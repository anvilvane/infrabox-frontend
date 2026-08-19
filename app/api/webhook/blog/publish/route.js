import { NextResponse } from 'next/server';
import { createPost } from '@/lib/blog';
import { createBlogPost, isGitHubConfigured } from '@/lib/github';
import matter from 'gray-matter';
import simpleGit from 'simple-git';
import path from 'path';

const git = simpleGit(process.cwd());

/**
 * Validate the Bearer token from the Authorization header
 * @param {Request} req - The incoming request
 * @returns {boolean} Whether the token is valid
 */
function validateAccessToken(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.split(' ')[1];
  const expectedToken = process.env.WEBHOOK_ACCESS_TOKEN;

  if (!expectedToken) {
    console.error('WEBHOOK_ACCESS_TOKEN is not configured');
    return false;
  }

  return token === expectedToken;
}

/**
 * Convert webhook article data to blog post format
 * @param {Object} article - Article from webhook payload
 * @returns {Object} Blog post data with frontmatter and content
 */
function convertArticleToBlogPost(article) {
  // Extract frontmatter from the article data
  const frontmatter = {
    title: article.title,
    description: article.meta_description,
    date: article.created_at,
    image: article.image_url,
    featured_image: article.image_url, // Support both naming conventions
    tags: article.tags || [],
    published: true,
    author: 'Admin', // Default author, can be customized
  };

  // Use content as-is - no conversion or formatting
  const content = article.content_html || article.content_markdown;

  if (!content) {
    throw new Error('No content provided (neither content_markdown nor content_html)');
  }

  return {
    title: article.title,
    content: content,
    frontmatter: frontmatter,
    slug: article.slug,
  };
}

/**
 * GET /api/webhook/blog/publish
 * Get webhook endpoint information and status
 */
export async function GET(req) {
  try {
    // Log request details
    console.log('=== GET Request to Webhook Endpoint ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('URL:', req.url);
    console.log('Method:', req.method);

    // Log headers
    const headers = {};
    req.headers.forEach((value, key) => {
      // Mask sensitive authorization header
      if (key.toLowerCase() === 'authorization') {
        headers[key] = value.substring(0, 20) + '...' + (value.length > 20 ? '[MASKED]' : '');
      } else {
        headers[key] = value;
      }
    });
    console.log('Headers:', JSON.stringify(headers, null, 2));

    // Log query parameters
    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams);
    console.log('Query Parameters:', JSON.stringify(queryParams, null, 2));

    // Check if webhook is configured
    const isConfigured = !!process.env.WEBHOOK_ACCESS_TOKEN;
    const useGitHubAPI = isGitHubConfigured();

    // Optional: Validate token if provided (for testing)
    const authHeader = req.headers.get('authorization');
    const isAuthenticated = authHeader ? validateAccessToken(req) : null;

    const response = {
      endpoint: '/api/webhook/blog/publish',
      status: 'operational',
      configured: isConfigured,
      request_info: {
        method: 'GET',
        timestamp: new Date().toISOString(),
        headers_received: Object.keys(headers).length,
        query_params: queryParams,
      },
      authentication: {
        type: 'Bearer Token',
        header: 'Authorization: Bearer <token>',
        configured: isConfigured,
        ...(isAuthenticated !== null && { valid: isAuthenticated })
      },
      integration: {
        github_api: useGitHubAPI,
        local_filesystem: !useGitHubAPI,
      },
      supported_events: ['publish_articles'],
      required_fields: {
        event_type: 'string (must be "publish_articles")',
        timestamp: 'string (ISO 8601 format)',
        data: {
          articles: 'array',
          article_fields: {
            required: ['id', 'title', 'slug', 'content_markdown OR content_html', 'created_at'],
            optional: ['meta_description', 'image_url', 'tags']
          }
        }
      },
      documentation: '/WEBHOOK_SETUP.md',
      timestamp: new Date().toISOString(),
    };

    // Add warning if not configured
    if (!isConfigured) {
      response.warning = 'WEBHOOK_ACCESS_TOKEN is not configured. Please set it in your environment variables.';
    }

    console.log('Response Status:', 200);
    console.log('Response:', JSON.stringify(response, null, 2));
    console.log('======================================');

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve webhook information',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/webhook/blog/publish
 * Webhook endpoint to receive and publish blog articles
 */
export async function POST(req) {
  try {
    // Validate access token
    if (!validateAccessToken(req)) {
      return NextResponse.json(
        { error: 'Invalid access token' },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const payload = await req.json();

    // Validate payload structure
    if (!payload.event_type || payload.event_type !== 'publish_articles') {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      );
    }

    if (!payload.data || !Array.isArray(payload.data.articles)) {
      return NextResponse.json(
        { error: 'Invalid payload structure: missing articles array' },
        { status: 400 }
      );
    }

    const articles = payload.data.articles;

    // Process each article
    const results = [];
    const errors = [];

    for (const article of articles) {
      try {
        // Validate required article fields
        if (!article.title || !article.slug) {
          errors.push({
            article_id: article.id,
            error: 'Missing required fields: title or slug',
          });
          continue;
        }

        if (!article.content_markdown && !article.content_html) {
          errors.push({
            article_id: article.id,
            error: 'Missing content: neither content_markdown nor content_html provided',
          });
          continue;
        }

        // Convert article to blog post format
        const blogPost = convertArticleToBlogPost(article);

        // Prepare file content - build YAML frontmatter manually to avoid HTML entity escaping
        const buildYamlFrontmatter = (data) => {
          let yaml = '';
          for (const [key, value] of Object.entries(data)) {
            if (Array.isArray(value)) {
              yaml += `${key}:\n`;
              value.forEach(item => {
                yaml += `  - ${item}\n`;
              });
            } else if (typeof value === 'string' && (value.includes('\n') || value.includes(':'))) {
              // Multi-line or contains special chars
              yaml += `${key}: >\n  ${value.replace(/\n/g, '\n  ')}\n`;
            } else {
              yaml += `${key}: ${value}\n`;
            }
          }
          return yaml;
        };

        const frontmatterString = buildYamlFrontmatter(blogPost.frontmatter);
        const fileContent = `---\n${frontmatterString}---\n${blogPost.content}`;

        // Check if GitHub API is configured
        const useGitHubAPI = isGitHubConfigured();
        const filename = `${blogPost.slug}.mdx`;
        const author = blogPost.frontmatter.author;

        if (useGitHubAPI) {
          // Use GitHub API (works in both dev and production)
          console.log(`Creating blog post via GitHub API: ${blogPost.title}`);

          const githubResult = await createBlogPost({
            filename,
            content: fileContent,
            title: blogPost.title,
            author,
          });

          if (!githubResult.success) {
            errors.push({
              article_id: article.id,
              slug: blogPost.slug,
              error: githubResult.error,
            });
            continue;
          }

          results.push({
            article_id: article.id,
            slug: blogPost.slug,
            filename,
            status: 'published',
            commit: githubResult.commit,
          });

        } else {
          // Fallback to local file system (development only)
          console.log(`Creating blog post locally: ${blogPost.title}`);

          const result = createPost(blogPost);

          if (!result.success) {
            errors.push({
              article_id: article.id,
              slug: blogPost.slug,
              error: result.error,
            });
            continue;
          }

          // Try local git commit
          try {
            const filePath = path.join('content', 'blog', filename);
            await git.add(filePath);

            const commitMessage = `Blog: Add "${blogPost.title}" by ${author}

Published via Webhook Integration`;

            await git.commit(commitMessage);
            await git.push('origin', 'main');

            results.push({
              article_id: article.id,
              slug: result.slug,
              filename: result.filename,
              status: 'published',
            });

          } catch (gitError) {
            console.error('Git operation failed:', gitError);

            // Consider this a partial success
            results.push({
              article_id: article.id,
              slug: result.slug,
              filename: result.filename,
              status: 'created_but_not_committed',
              warning: 'Post created but git commit failed',
            });
          }
        }

      } catch (articleError) {
        console.error(`Error processing article ${article.id}:`, articleError);
        errors.push({
          article_id: article.id,
          error: articleError.message,
        });
      }
    }

    // Prepare response
    const response = {
      message: 'Webhook processed successfully',
      timestamp: new Date().toISOString(),
      processed: articles.length,
      successful: results.length,
      failed: errors.length,
    };

    if (results.length > 0) {
      response.results = results;
    }

    if (errors.length > 0) {
      response.errors = errors;
    }

    // Return appropriate status code
    const statusCode = errors.length === 0 ? 200 : (results.length > 0 ? 207 : 400);

    return NextResponse.json(response, { status: statusCode });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      {
        error: 'Failed to process webhook',
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
