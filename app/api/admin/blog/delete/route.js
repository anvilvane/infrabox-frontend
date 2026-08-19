import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth-check';
import { deletePost, getPostBySlug } from '@/lib/blog';
import { deleteBlogPost, isGitHubConfigured } from '@/lib/github';
import simpleGit from 'simple-git';
import path from 'path';

const git = simpleGit(process.cwd());

/**
 * DELETE /api/admin/blog/delete
 * Delete a blog post and commit to git
 */
export async function DELETE(req) {
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
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    const filename = `${slug}.mdx`;

    // Get post title for commit message
    const post = getPostBySlug(slug);
    const title = post?.frontmatter?.title || slug;
    const author = 'Admin';

    // Check if GitHub API is configured
    const useGitHubAPI = isGitHubConfigured();

    if (useGitHubAPI) {
      // Use GitHub API
      console.log('Using GitHub API for blog post deletion');

      const githubResult = await deleteBlogPost({
        filename,
        title,
        author,
      });

      if (!githubResult.success) {
        return NextResponse.json(
          { error: githubResult.error },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Post deleted and committed to GitHub',
      });

    } else {
      // Fallback to local file system
      console.log('Using local file system for blog post deletion');

      const result = deletePost(slug);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        );
      }

      // Try local git commit
      try {
        const filePath = path.join('content', 'blog', filename);

        await git.rm(filePath);

        const commitMessage = `Blog: Delete "${title}" by ${author}

Deleted via Infrabox Blog CMS`;

        await git.commit(commitMessage);
        await git.push('origin', 'main');

        return NextResponse.json({
          success: true,
          message: 'Post deleted and committed to git',
        });

      } catch (gitError) {
        console.error('Git operation failed:', gitError);

        return NextResponse.json({
          success: true,
          warning: 'Post deleted but git commit failed. Please commit manually.',
          gitError: gitError.message,
        });
      }
    }

  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post', details: error.message },
      { status: 500 }
    );
  }
}
