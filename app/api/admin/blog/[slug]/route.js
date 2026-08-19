import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth-check';
import { getPostBySlug } from '@/lib/blog';

/**
 * GET /api/admin/blog/[slug]
 * Get a single blog post by slug
 */
export async function GET(req, { params }) {
  try {
    // Check authentication
    const session = await checkAuth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    const post = getPostBySlug(slug);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post,
    });

  } catch (error) {
    console.error('Error getting post:', error);
    return NextResponse.json(
      { error: 'Failed to get post', details: error.message },
      { status: 500 }
    );
  }
}
