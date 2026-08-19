/**
 * GitHub API Integration for Blog CMS
 * Allows creating, updating, and deleting blog posts via GitHub API
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'akshay-prasath'; // Your GitHub username
const GITHUB_REPO = process.env.GITHUB_REPO || 'infrabox'; // Your repo name
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

/**
 * Get file content from GitHub
 * @param {string} path - File path in repository
 * @returns {Object|null} File data or null
 */
async function getFileFromGitHub(path) {
  try {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Infrabox-Blog-CMS',
      },
    });

    if (response.status === 404) {
      return null; // File doesn't exist
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching file from GitHub:', error);
    return null;
  }
}

/**
 * Create or update a file in GitHub
 * @param {Object} params - File parameters
 * @param {string} params.path - File path in repository
 * @param {string} params.content - File content (will be base64 encoded)
 * @param {string} params.message - Commit message
 * @param {string} params.sha - SHA of existing file (required for updates)
 * @returns {Object} Result with success status
 */
async function createOrUpdateFile({ path, content, message, sha = null }) {
  try {
    if (!GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN environment variable is not set');
    }

    console.log('GitHub API Request:', {
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
      branch: GITHUB_BRANCH,
      hasToken: !!GITHUB_TOKEN,
      tokenPrefix: GITHUB_TOKEN?.substring(0, 20) + '...',
      updating: !!sha,
    });

    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;

    // Base64 encode the content
    const encodedContent = Buffer.from(content, 'utf8').toString('base64');

    const body = {
      message,
      content: encodedContent,
      branch: GITHUB_BRANCH,
    };

    // Include SHA for updates (not for new files)
    if (sha) {
      body.sha = sha;
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Infrabox-Blog-CMS',
      },
      body: JSON.stringify(body),
    });

    // Get response text first to debug
    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage = `GitHub API error: ${response.status} ${response.statusText}`;

      try {
        const error = JSON.parse(responseText);
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // Response wasn't JSON, use text
        errorMessage = responseText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    // Parse the JSON response
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Failed to parse GitHub API response: ${responseText}`);
    }

    return {
      success: true,
      sha: data.content.sha,
      commit: data.commit,
    };
  } catch (error) {
    console.error('Error creating/updating file in GitHub:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Delete a file from GitHub
 * @param {Object} params - Delete parameters
 * @param {string} params.path - File path in repository
 * @param {string} params.message - Commit message
 * @param {string} params.sha - SHA of file to delete
 * @returns {Object} Result with success status
 */
async function deleteFile({ path, message, sha }) {
  try {
    if (!GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN environment variable is not set');
    }

    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Infrabox-Blog-CMS',
      },
      body: JSON.stringify({
        message,
        sha,
        branch: GITHUB_BRANCH,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `GitHub API error: ${response.statusText}`);
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting file from GitHub:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Create a blog post file via GitHub API
 * @param {Object} params - Blog post parameters
 * @param {string} params.filename - File name (e.g., "my-post.mdx")
 * @param {string} params.content - File content
 * @param {string} params.title - Post title (for commit message)
 * @param {string} params.author - Author name (for commit message)
 * @returns {Object} Result with success status
 */
export async function createBlogPost({ filename, content, title, author = 'Admin' }) {
  const path = `content/blog/${filename}`;
  const message = `Blog: Add "${title}" by ${author}

Published via Infrabox Blog CMS`;

  return await createOrUpdateFile({ path, content, message });
}

/**
 * Update a blog post file via GitHub API
 * @param {Object} params - Blog post parameters
 * @param {string} params.filename - File name (e.g., "my-post.mdx")
 * @param {string} params.content - File content
 * @param {string} params.title - Post title (for commit message)
 * @param {string} params.author - Author name (for commit message)
 * @returns {Object} Result with success status
 */
export async function updateBlogPost({ filename, content, title, author = 'Admin' }) {
  const path = `content/blog/${filename}`;

  // Get existing file to get SHA
  const existingFile = await getFileFromGitHub(path);

  if (!existingFile) {
    return {
      success: false,
      error: 'File not found',
    };
  }

  const message = `Blog: Update "${title}" by ${author}

Updated via Infrabox Blog CMS`;

  return await createOrUpdateFile({
    path,
    content,
    message,
    sha: existingFile.sha
  });
}

/**
 * Delete a blog post file via GitHub API
 * @param {Object} params - Blog post parameters
 * @param {string} params.filename - File name (e.g., "my-post.mdx")
 * @param {string} params.title - Post title (for commit message)
 * @param {string} params.author - Author name (for commit message)
 * @returns {Object} Result with success status
 */
export async function deleteBlogPost({ filename, title, author = 'Admin' }) {
  const path = `content/blog/${filename}`;

  // Get existing file to get SHA
  const existingFile = await getFileFromGitHub(path);

  if (!existingFile) {
    return {
      success: false,
      error: 'File not found',
    };
  }

  const message = `Blog: Delete "${title}" by ${author}

Deleted via Infrabox Blog CMS`;

  return await deleteFile({
    path,
    message,
    sha: existingFile.sha
  });
}

/**
 * Check if GitHub integration is configured
 * @returns {boolean} True if configured
 */
export function isGitHubConfigured() {
  return Boolean(GITHUB_TOKEN);
}
