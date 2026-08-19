import { NextResponse } from 'next/server';
import dns from 'dns';
import { promisify } from 'util';
import { disposableDomains, roleBasedUsers } from '@/lib/disposable-domains';
import { LRUCache } from 'lru-cache';

const resolveMx = promisify(dns.resolveMx);

// Cache configuration: Max 500 items, 1 hour TTL
const cache = new LRUCache({
    max: 500,
    ttl: 1000 * 60 * 60,
});

// Simple in-memory rate limiter: IP -> { count, timestamp }
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20; // 20 requests per minute

function getClientIp(request) {
    return request.headers.get('x-forwarded-for') || 'unknown';
}

function checkRateLimit(ip) {
    const now = Date.now();
    const record = rateLimit.get(ip);

    if (!record) {
        rateLimit.set(ip, { count: 1, timestamp: now });
        return true;
    }

    if (now - record.timestamp > RATE_LIMIT_WINDOW) {
        // Reset window
        rateLimit.set(ip, { count: 1, timestamp: now });
        return true;
    }

    if (record.count >= MAX_REQUESTS_PER_WINDOW) {
        return false;
    }

    record.count++;
    return true;
}

export async function POST(request) {
    try {
        const ip = getClientIp(request);
        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        const { email } = await request.json();

        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const trimmedEmail = email.trim().toLowerCase();

        // Check cache
        if (cache.has(trimmedEmail)) {
            return NextResponse.json(cache.get(trimmedEmail));
        }

        const result = await verifyEmail(trimmedEmail);

        // Cache result
        cache.set(trimmedEmail, result);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.json(
            { error: 'Failed to verify email' },
            { status: 500 }
        );
    }
}

async function verifyEmail(email) {
    const result = {
        email,
        isValid: false,
        score: 0, // 0-100
        checks: {
            syntax: { valid: false, message: '' },
            disposable: { isDisposable: false, message: '' },
            role: { isRole: false, message: '' },
            mx: { valid: false, records: [], message: '' },
        },
        status: 'invalid', // valid, invalid, risky
    };

    // 1. Syntax Check
    // RFC 5322 Official Standard Regex (simplified for practical use)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        result.checks.syntax.message = 'Invalid email format';
        result.status = 'invalid';
        return result;
    }
    result.checks.syntax.valid = true;
    result.checks.syntax.message = 'Valid format';

    const [user, domain] = email.split('@');

    // 2. Disposable Check
    if (disposableDomains.has(domain)) {
        result.checks.disposable.isDisposable = true;
        result.checks.disposable.message = 'Disposable domain detected';
        result.status = 'risky'; // Disposable is risky/invalid depending on use case
        result.score = 10;
    } else {
        result.checks.disposable.message = 'Standard domain';
    }

    // 3. Role-Based Check
    if (roleBasedUsers.has(user)) {
        result.checks.role.isRole = true;
        result.checks.role.message = 'Role-based account detected';
        // Role based isn't invalid, but can be risky for marketing
    } else {
        result.checks.role.message = 'Personal account';
    }

    // 4. MX Record Check
    try {
        const records = await resolveMx(domain);
        if (records && records.length > 0) {
            result.checks.mx.valid = true;
            result.checks.mx.records = records.sort((a, b) => a.priority - b.priority);
            result.checks.mx.message = 'Mail servers found';
        } else {
            result.checks.mx.message = 'No mail servers found';
            result.status = 'invalid';
            result.score = 0;
            return result; // No MX means invalid
        }
    } catch (error) {
        if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
            result.checks.mx.message = 'Domain does not exist or has no MX records';
            result.status = 'invalid';
            result.score = 0;
            return result;
        }
        // Other DNS errors (timeout etc) - treat as unknown/risky but don't fail hard if possible?
        // For now, fail hard for reliability
        result.checks.mx.message = 'DNS lookup failed';
        result.status = 'unknown';
        return result;
    }

    // Calculate Score & Final Status
    if (result.checks.disposable.isDisposable) {
        result.status = 'risky';
        result.score = 20;
    } else if (result.checks.role.isRole) {
        result.status = 'valid'; // Technically valid
        result.score = 80; // Slightly lower score due to role
    } else {
        result.status = 'valid';
        result.score = 100;
    }

    result.isValid = true;
    return result;
}
