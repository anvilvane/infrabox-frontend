import { NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import crypto from 'crypto';
import {
  getClientIP,
  isIPBlocked,
  getBlockTimeRemaining,
  recordFailedAttempt,
  clearFailedAttempts,
} from '@/lib/rate-limit';

/**
 * POST /api/admin/auth/verify
 * Verify TOTP code and set auth cookie
 */
export async function POST(req) {
  try {
    // Get client IP
    const clientIP = getClientIP(req);

    // Check if IP is blocked (now async)
    if (await isIPBlocked(clientIP)) {
      const timeRemaining = await getBlockTimeRemaining(clientIP);
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed attempts`,
          blocked: true,
        },
        { status: 429 }
      );
    }

    const { otpCode } = await req.json();

    if (!otpCode || otpCode.length !== 6) {
      return NextResponse.json(
        { success: false, error: 'Please enter a 6-digit code' },
        { status: 400 }
      );
    }

    // Get the TOTP secret from environment variable
    const TOTP_SECRET = process.env.TOTP_SECRET;

    if (!TOTP_SECRET) {
      console.error('TOTP_SECRET not set in environment variables');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Verify the TOTP code
    const isValid = authenticator.check(otpCode, TOTP_SECRET);

    if (!isValid) {
      // Record failed attempt (now async)
      const rateLimit = await recordFailedAttempt(clientIP);

      if (rateLimit.blocked) {
        return NextResponse.json(
          {
            success: false,
            error: 'Too many failed attempts. Try again later.',
            blocked: true,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: `Invalid or expired code. ${rateLimit.attemptsRemaining} attempt${rateLimit.attemptsRemaining !== 1 ? 's' : ''} remaining.`,
          attemptsRemaining: rateLimit.attemptsRemaining,
        },
        { status: 401 }
      );
    }

    // Valid code - clear failed attempts (now async)
    await clearFailedAttempts(clientIP);

    // Generate a session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days

    // Create session data
    const sessionData = {
      token: sessionToken,
      expiresAt,
      authenticated: true,
    };

    // Set httpOnly cookie
    const response = NextResponse.json({ success: true });

    response.cookies.set('admin_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
