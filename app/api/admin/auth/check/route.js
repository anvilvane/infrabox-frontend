import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth-check';

// Force dynamic rendering (uses cookies)
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/auth/check
 * Check if user is authenticated
 */
export async function GET() {
  try {
    const session = await checkAuth();

    if (session) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ authenticated: false });
  }
}
