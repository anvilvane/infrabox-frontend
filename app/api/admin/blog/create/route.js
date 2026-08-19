import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth-check';
import { createPost } from '@/lib/blog';
import { createBlogPost, isGitHubConfigured } from '@/lib/github';
import simpleGit from 'simple-git';
import path from 'path';
import matter from 'gray-matter';

const git = simpleGit(process.cwd());

/**
 * POST /api/admin/blog/create
 * Create a new blog post and commit to git
 */
export async function POST(req) {
  try {
    // Check authentication
    const session = await checkAuth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please set up authentication' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, content, frontmatter, slug } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Prepare file content
    const fileContent = matter.stringify(content, frontmatter);

    // Check if GitHub API is configured
    const useGitHubAPI = isGitHubConfigured();
    const author = frontmatter.author || 'Admin';

    if (useGitHubAPI) {
      // Use GitHub API (works in both dev and production)
      console.log('Using GitHub API for blog post creation');

      // Generate slug if not provided
      const finalSlug = slug || title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/(^-|-$)/g, '');

      const filename = `${finalSlug}.mdx`;

      const githubResult = await createBlogPost({
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
        slug: finalSlug,
        filename,
        message: 'Post created and committed to GitHub',
        commit: githubResult.commit,
      });

    } else {
      // Fallback to local file system (development only)
      console.log('Using local file system for blog post creation');

      const result = createPost({ title, content, frontmatter, slug });

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        );
      }

      // Try local git commit
      try {
        const filePath = path.join('content', 'blog', result.filename);

        await git.add(filePath);

        const commitMessage = `Blog: Add "${title}" by ${author}

Published via Infrabox Blog CMS`;

        await git.commit(commitMessage);
        await git.push('origin', 'main');

        return NextResponse.json({
          success: true,
          slug: result.slug,
          filename: result.filename,
          message: 'Post created and committed to git',
        });

      } catch (gitError) {
        console.error('Git operation failed:', gitError);

        return NextResponse.json({
          success: true,
          slug: result.slug,
          filename: result.filename,
          warning: 'Post created but git commit failed. Please commit manually.',
          gitError: gitError.message,
        });
      }
    }

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post', details: error.message },
      { status: 500 }
    );
  }
}
