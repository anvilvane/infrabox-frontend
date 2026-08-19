import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { format } from 'date-fns';

/**
 * Parse a date string, handling YAML folded scalar issues (newlines, whitespace)
 * @param {string} dateStr - Raw date string from frontmatter
 * @returns {Date|null} Valid Date object or null if parsing fails
 */
export function parseDate(dateStr) {
  if (!dateStr) return null;
  try {
    const cleaned = String(dateStr).trim().replace(/\n/g, '').replace(/\r/g, '');
    const dateObj = new Date(cleaned);
    if (!dateObj || isNaN(dateObj.getTime()) || dateObj.getTime() === 0) {
      return null;
    }
    return dateObj;
  } catch (e) {
    return null;
  }
}

const contentDirectory = path.join(process.cwd(), 'content');
const blogDirectory = path.join(contentDirectory, 'blog');
const authorsPath = path.join(contentDirectory, 'authors', 'authors.json');
const categoriesPath = path.join(contentDirectory, 'categories', 'categories.json');

// Ensure directories exist
if (!fs.existsSync(blogDirectory)) {
  fs.mkdirSync(blogDirectory, { recursive: true });
}

/**
 * Get all blog posts from the content/blog directory
 * @param {boolean} includeUnpublished - Include unpublished posts
 * @returns {Array} Array of post objects with frontmatter and metadata
 */
export function getAllPosts(includeUnpublished = false) {
  try {
    const files = fs.readdirSync(blogDirectory);
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));

    const posts = mdxFiles
      .map(filename => {
        const slug = filename.replace(/\.mdx$/, '');
        const filePath = path.join(blogDirectory, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        // Calculate reading time
        const stats = readingTime(content);

        return {
          slug,
          filename,
          frontmatter: data,
          content,
          readingTime: stats.text,
          readingMinutes: Math.ceil(stats.minutes),
        };
      })
      .filter(post => includeUnpublished || post.frontmatter.published !== false)
      .sort((a, b) => {
        const dateA = new Date(a.frontmatter.date);
        const dateB = new Date(b.frontmatter.date);
        return dateB - dateA; // Most recent first
      });

    return posts;
  } catch (error) {
    console.error('Error getting all posts:', error);
    return [];
  }
}

/**
 * Get a single post by slug
 * @param {string} slug - The post slug
 * @returns {Object|null} Post object or null if not found
 */
export function getPostBySlug(slug) {
  try {
    const filename = `${slug}.mdx`;
    const filePath = path.join(blogDirectory, filename);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const stats = readingTime(content);

    return {
      slug,
      filename,
      frontmatter: data,
      content,
      readingTime: stats.text,
      readingMinutes: Math.ceil(stats.minutes),
    };
  } catch (error) {
    console.error(`Error getting post ${slug}:`, error);
    return null;
  }
}

/**
 * Get posts by category
 * @param {string} category - Category slug
 * @returns {Array} Array of posts in the category
 */
export function getPostsByCategory(category) {
  const allPosts = getAllPosts();
  return allPosts.filter(post => post.frontmatter.category === category);
}

/**
 * Get posts by tag
 * @param {string} tag - Tag name
 * @returns {Array} Array of posts with the tag
 */
export function getPostsByTag(tag) {
  const allPosts = getAllPosts();
  return allPosts.filter(post =>
    post.frontmatter.tags && post.frontmatter.tags.includes(tag)
  );
}

/**
 * Get related posts based on tags and category
 * @param {string} slug - Current post slug
 * @param {number} limit - Maximum number of related posts
 * @returns {Array} Array of related posts
 */
export function getRelatedPosts(slug, limit = 3) {
  const currentPost = getPostBySlug(slug);
  if (!currentPost) return [];

  const allPosts = getAllPosts().filter(post => post.slug !== slug);
  const currentTags = currentPost.frontmatter.tags || [];
  const currentCategory = currentPost.frontmatter.category;

  // Score posts based on matching tags and category
  const scoredPosts = allPosts.map(post => {
    let score = 0;
    const postTags = post.frontmatter.tags || [];

    // Same category gets 2 points
    if (post.frontmatter.category === currentCategory) {
      score += 2;
    }

    // Each matching tag gets 1 point
    postTags.forEach(tag => {
      if (currentTags.includes(tag)) {
        score += 1;
      }
    });

    return { ...post, score };
  });

  // Sort by score (highest first) and return limited results
  return scoredPosts
    .filter(post => post.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Generate a URL-safe slug from a title
 * @param {string} title - Post title
 * @returns {string} URL-safe slug
 */
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate filename with date prefix
 * @param {string} title - Post title
 * @param {string} date - Date string (YYYY-MM-DD)
 * @returns {string} Filename with date prefix
 */
export function generateFilename(title, date = null) {
  const slug = generateSlug(title);
  const datePrefix = date || format(new Date(), 'yyyy-MM-dd');
  return `${datePrefix}-${slug}.mdx`;
}

/**
 * Get all unique categories from posts
 * @returns {Array} Array of category names
 */
export function getAllCategories() {
  try {
    const categoriesData = fs.readFileSync(categoriesPath, 'utf8');
    return JSON.parse(categoriesData);
  } catch (error) {
    console.error('Error reading categories:', error);
    return [];
  }
}

/**
 * Get all unique tags from all posts
 * @returns {Array} Array of unique tags
 */
export function getAllTags() {
  const allPosts = getAllPosts();
  const tags = new Set();

  allPosts.forEach(post => {
    if (post.frontmatter.tags) {
      post.frontmatter.tags.forEach(tag => tags.add(tag));
    }
  });

  return Array.from(tags).sort();
}

/**
 * Get all authors
 * @returns {Array} Array of author objects
 */
export function getAllAuthors() {
  try {
    const authorsData = fs.readFileSync(authorsPath, 'utf8');
    return JSON.parse(authorsData);
  } catch (error) {
    console.error('Error reading authors:', error);
    return [];
  }
}

/**
 * Get author by ID
 * @param {string} authorId - Author ID
 * @returns {Object|null} Author object or null
 */
export function getAuthorById(authorId) {
  const authors = getAllAuthors();
  return authors.find(author => author.id === authorId) || null;
}

/**
 * Create a new blog post
 * @param {Object} postData - Post data including frontmatter, content, and optional slug
 * @returns {Object} Result with success status and slug
 */
export function createPost(postData) {
  try {
    const { title, content, frontmatter, slug: customSlug } = postData;

    // Use custom slug if provided, otherwise generate from title
    const slug = customSlug || generateSlug(title);
    const filename = `${slug}.mdx`;
    const filePath = path.join(blogDirectory, filename);

    // Check if file already exists
    if (fs.existsSync(filePath)) {
      return { success: false, error: 'Post with this URL already exists. Please use a different slug.' };
    }

    // Create frontmatter string
    const frontmatterString = matter.stringify(content, frontmatter);

    // Write file
    fs.writeFileSync(filePath, frontmatterString, 'utf8');

    return { success: true, slug, filename };
  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update an existing blog post
 * @param {string} slug - Post slug
 * @param {Object} postData - Updated post data
 * @returns {Object} Result with success status
 */
export function updatePost(slug, postData) {
  try {
    const { content, frontmatter } = postData;
    const filename = `${slug}.mdx`;
    const filePath = path.join(blogDirectory, filename);

    if (!fs.existsSync(filePath)) {
      return { success: false, error: 'Post not found' };
    }

    // Create frontmatter string
    const frontmatterString = matter.stringify(content, frontmatter);

    // Write file
    fs.writeFileSync(filePath, frontmatterString, 'utf8');

    return { success: true, slug };
  } catch (error) {
    console.error('Error updating post:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a blog post
 * @param {string} slug - Post slug
 * @returns {Object} Result with success status
 */
export function deletePost(slug) {
  try {
    const filename = `${slug}.mdx`;
    const filePath = path.join(blogDirectory, filename);

    if (!fs.existsSync(filePath)) {
      return { success: false, error: 'Post not found' };
    }

    fs.unlinkSync(filePath);

    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get post statistics
 * @returns {Object} Statistics about blog posts
 */
export function getBlogStats() {
  const allPosts = getAllPosts(true);
  const publishedPosts = allPosts.filter(post => post.frontmatter.published !== false);
  const categories = getAllCategories();
  const tags = getAllTags();

  return {
    total: allPosts.length,
    published: publishedPosts.length,
    drafts: allPosts.length - publishedPosts.length,
    categories: categories.length,
    tags: tags.length,
  };
}
