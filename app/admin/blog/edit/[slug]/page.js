'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function EditBlogPost({ params }) {
  const router = useRouter();
  const { slug } = params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'email-deliverability',
    tags: '',
    author: 'default',
    featuredImage: '',
    seoKeywords: '',
    published: true,
    date: '',
  });

  const categories = [
    'email-deliverability',
    'dns-setup',
    'email',
    'email-warmup',
    'tools-guides',
    'agency-tips',
  ];

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/admin/blog/${slug}`);
      const data = await response.json();

      if (data.success) {
        const post = data.post;
        setFormData({
          title: post.frontmatter.title || '',
          description: post.frontmatter.description || '',
          content: post.content || '',
          category: post.frontmatter.category || 'email-deliverability',
          tags: (post.frontmatter.tags || []).join(', '),
          author: post.frontmatter.author || 'default',
          featuredImage: post.frontmatter.featured_image || '',
          seoKeywords: post.frontmatter.seo_keywords || '',
          published: post.frontmatter.published !== false,
          date: post.frontmatter.date || '',
        });
      } else {
        alert('Post not found');
        router.push('/admin/blog');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setImageUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/blog/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        handleChange('featuredImage', data.url);
        alert('Image uploaded successfully!');
      } else {
        alert(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      alert('Title and content are required');
      return;
    }

    try {
      setSaving(true);

      // Parse tags
      const tags = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      // Prepare frontmatter
      const frontmatter = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        author: formData.author,
        category: formData.category,
        tags,
        featured_image: formData.featuredImage,
        seo_keywords: formData.seoKeywords,
        published: formData.published,
      };

      const response = await fetch('/api/admin/blog/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          content: formData.content,
          frontmatter,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Post updated successfully!');
        router.push('/admin/blog');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      [{ color: [] }, { background: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="loading loading-spinner loading-lg"></div>
        <p className="mt-4 text-gray-600">Loading post...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
        <p className="text-gray-600 mt-2">Update your blog post</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1240cc] focus:border-transparent"
                placeholder="Enter post title..."
                required
              />
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (SEO)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1240cc] focus:border-transparent"
                placeholder="Brief description for SEO and social sharing..."
              />
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(value) => handleChange('content', value)}
                  modules={modules}
                  className="bg-white"
                  style={{ minHeight: '400px' }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.published}
                    onChange={(e) => handleChange('published', e.target.value === 'true')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1240cc] focus:border-transparent"
                  >
                    <option value="true">Published</option>
                    <option value="false">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1240cc] focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full mt-6 bg-[#1240cc] text-white px-6 py-3 rounded-lg hover:bg-[#001f7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Update Post'}
              </button>

              {formData.published && (
                <a
                  href={`/resources/blog/${slug}`}
                  target="_blank"
                  className="block w-full mt-3 text-center border border-[#1240cc] text-[#1240cc] px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Post
                </a>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1240cc] focus:border-transparent"
                placeholder="tag1, tag2, tag3"
              />
              <p className="text-sm text-gray-500 mt-2">Separate tags with commas</p>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h3>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={imageUploading}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1240cc] file:text-white hover:file:bg-[#001f7a] file:cursor-pointer"
              />
              {imageUploading && (
                <p className="text-sm text-gray-500 mt-2">Uploading...</p>
              )}
              {formData.featuredImage && (
                <div className="mt-4">
                  <img
                    src={formData.featuredImage}
                    alt="Featured"
                    className="w-full rounded-lg"
                  />
                  <input
                    type="text"
                    value={formData.featuredImage}
                    onChange={(e) => handleChange('featuredImage', e.target.value)}
                    className="w-full mt-2 px-3 py-1 text-sm border border-gray-300 rounded"
                    placeholder="Image URL"
                  />
                </div>
              )}
            </div>

            {/* SEO Keywords */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Keywords</h3>
              <input
                type="text"
                value={formData.seoKeywords}
                onChange={(e) => handleChange('seoKeywords', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1240cc] focus:border-transparent"
                placeholder="keyword1, keyword2"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
