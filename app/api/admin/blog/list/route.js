import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth-check';
import { getAllPosts, getBlogStats, getAllCategories, getAllTags } from '@/lib/blog';

/**
 * GET /api/admin/blog/list
 * Get all blog posts including unpublished
 */
export async function GET(req) {
  try {
    // Check authentication
    const session = await checkAuth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true';

    const posts = getAllPosts(includeUnpublished);
    const stats = getBlogStats();
    const categories = getAllCategories();
    const tags = getAllTags();

    return NextResponse.json({
      success: true,
      posts,
      stats,
      categories,
      tags,
    });

  } catch (error) {
    console.error('Error listing posts:', error);
    return NextResponse.json(
      { error: 'Failed to list posts', details: error.message },
      { status: 500 }
    );
  }
}
