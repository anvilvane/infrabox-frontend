import { cookies } from 'next/headers';

/**
 * Check if user is authenticated via secret key cookie
 * Returns session object if authenticated, null otherwise
 */
export async function checkAuth() {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('admin_session');

    if (!sessionCookie) {
      return null;
    }

    // Parse session data
    const sessionData = JSON.parse(sessionCookie.value);

    // Check if session is expired
    if (sessionData.expiresAt < Date.now()) {
      return null;
    }

    // Check if authenticated flag is set
    if (!sessionData.authenticated) {
      return null;
    }

    // Return mock session object
    return {
      user: {
        name: 'Admin User',
        email: 'admin@infrabox.software',
      },
      authenticated: true,
    };
  } catch (error) {
    console.error('Auth check error:', error);
    return null;
  }
}

/**
 * Verify user is authenticated or throw error
 */
export async function requireAuth() {
  const session = await checkAuth();

  if (!session) {
    throw new Error('Authentication required');
  }

  return session;
}
