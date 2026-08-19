import { NextResponse } from 'next/server';
import BlacklistChecker from './checker';

export const runtime = 'nodejs'; // Required for 'dns' module

export async function POST(request) {
    try {
        const { domain } = await request.json();

        if (!domain) {
            return NextResponse.json(
                { error: true, message: 'Domain or IP is required' },
                { status: 400 }
            );
        }

        // Clean input
        const cleanInput = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').trim();

        const checker = new BlacklistChecker();
        let result;

        if (checker.isValidIP(cleanInput)) {
            result = await checker.checkIP(cleanInput);
        } else {
            result = await checker.checkDomain(cleanInput);
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: true, message: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
