'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, published, drafts

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/blog/list?includeUnpublished=true');
      const data = await response.json();

      if (data.success) {
        setPosts(data.posts);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blog/delete?slug=${slug}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert('Post deleted successfully!');
        fetchPosts();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (filter === 'published') return post.frontmatter.published !== false;
    if (filter === 'drafts') return post.frontmatter.published === false;
    return true;
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="loading loading-spinner loading-lg"></div>
        <p className="mt-4 text-gray-600">Loading posts...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Total Posts</div>
            <div className="text-3xl font-bold text-[#1240cc] mt-2">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Published</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{stats.published}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Drafts</div>
            <div className="text-3xl font-bold text-amber-600 mt-2">{stats.drafts}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Categories</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">{stats.categories}</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="bg-[#1240cc] text-white px-6 py-2 rounded-lg hover:bg-[#001f7a] transition-colors"
        >
          New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-[#1240cc] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({stats?.total || 0})
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'published'
                ? 'bg-[#1240cc] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Published ({stats?.published || 0})
          </button>
          <button
            onClick={() => setFilter('drafts')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'drafts'
                ? 'bg-[#1240cc] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Drafts ({stats?.drafts || 0})
          </button>
        </div>
      </div>

      {/* Posts Table */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg">No posts found</p>
          <Link
            href="/admin/blog/new"
            className="inline-block mt-4 text-[#1240cc] hover:underline"
          >
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post.slug} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {post.frontmatter.title || post.slug}
                    </div>
                    <div className="text-sm text-gray-500">{post.readingTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {post.frontmatter.published === false ? (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                        Draft
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Published
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.frontmatter.date && (() => {
                      try {
                        const dateStr = String(post.frontmatter.date).trim().replace(/\n/g, '').replace(/\r/g, '');
                        const dateObj = new Date(dateStr);
                        if (!dateObj || isNaN(dateObj.getTime()) || dateObj.getTime() === 0) {
                          return '-';
                        }
                        return format(dateObj, 'MMM d, yyyy');
                      } catch (e) {
                        return '-';
                      }
                    })() || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <Link
                      href={`/admin/blog/edit/${post.slug}`}
                      className="text-[#1240cc] hover:underline"
                    >
                      Edit
                    </Link>
                    {post.frontmatter.published !== false && (
                      <Link
                        href={`/resources/blog/${post.slug}`}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                    )}
                    <button
                      onClick={() => handleDelete(post.slug, post.frontmatter.title)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
