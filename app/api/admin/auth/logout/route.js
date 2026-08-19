import { NextResponse } from 'next/server';

/**
 * POST /api/admin/auth/logout
 * Clear the admin session cookie
 */
export async function POST() {
  try {
    const response = NextResponse.json({ success: true });

    // Clear the admin session cookie
    response.cookies.set('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}
