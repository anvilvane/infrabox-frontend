import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth-check';
import { updatePost } from '@/lib/blog';
import { updateBlogPost, isGitHubConfigured } from '@/lib/github';
import simpleGit from 'simple-git';
import path from 'path';
import matter from 'gray-matter';

const git = simpleGit(process.cwd());

/**
 * PUT /api/admin/blog/update
 * Update an existing blog post and commit to git
 */
export async function PUT(req) {
  try {
    // Check authentication
    const session = await checkAuth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { slug, content, frontmatter } = body;

    // Validate required fields
    if (!slug || !content) {
      return NextResponse.json(
        { error: 'Slug and content are required' },
        { status: 400 }
      );
    }

    // Prepare file content
    const fileContent = matter.stringify(content, frontmatter);
    const filename = `${slug}.mdx`;
    const author = frontmatter?.author || 'Admin';
    const title = frontmatter?.title || slug;

    // Check if GitHub API is configured
    const useGitHubAPI = isGitHubConfigured();

    if (useGitHubAPI) {
      // Use GitHub API
      console.log('Using GitHub API for blog post update');

      const githubResult = await updateBlogPost({
        filename,
        content: fileContent,
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
        slug,
        message: 'Post updated and committed to GitHub',
        commit: githubResult.commit,
      });

    } else {
      // Fallback to local file system
      console.log('Using local file system for blog post update');

      const result = updatePost(slug, { content, frontmatter });

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        );
      }

      // Try local git commit
      try {
        const filePath = path.join('content', 'blog', filename);

        await git.add(filePath);

        const commitMessage = `Blog: Update "${title}" by ${author}

Updated via Infrabox Blog CMS`;

        await git.commit(commitMessage);
        await git.push('origin', 'main');

        return NextResponse.json({
          success: true,
          slug: result.slug,
          message: 'Post updated and committed to git',
        });

      } catch (gitError) {
        console.error('Git operation failed:', gitError);

        return NextResponse.json({
          success: true,
          slug: result.slug,
          warning: 'Post updated but git commit failed. Please commit manually.',
          gitError: gitError.message,
        });
      }
    }

  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post', details: error.message },
      { status: 500 }
    );
  }
}
