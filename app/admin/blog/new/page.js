'use client';

import { useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Eye, Save, FileText, Image as ImageIcon, Tag, Calendar, User, Globe } from 'lucide-react';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function NewBlogPost() {
  const router = useRouter();
  const quillRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    category: 'email-deliverability',
    tags: '',
    author: 'Infrabox Team',
    featuredImage: '',
    seoKeywords: '',
    published: true,
    date: new Date().toISOString().split('T')[0],
  });

  const categories = [
    'email-deliverability',
    'dns-setup',
    'email',
    'email-warmup',
    'tools-guides',
    'agency-tips',
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-generate slug from title (no date prefix)
      if (field === 'title' && !prev.slug) {
        updated.slug = value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-')          // Replace spaces with hyphens
          .replace(/-+/g, '-')           // Replace multiple hyphens with single
          .replace(/(^-|-$)/g, '');      // Remove leading/trailing hyphens
      }

      return updated;
    });
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
      setLoading(true);

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

      const response = await fetch('/api/admin/blog/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug, // Send custom slug
          content: formData.content,
          frontmatter,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Post created successfully!');
        router.push('/admin/blog');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload from editor
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      try {
        setImageUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const response = await fetch('/api/admin/blog/upload-image', {
          method: 'POST',
          body: uploadFormData,
        });

        const data = await response.json();

        if (data.success) {
          // Get Quill instance and insert image
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', data.url);
            quill.setSelection(range.index + 1);
          }
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
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [2, 3, 4, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: {
        image: imageHandler,
      },
    },
    clipboard: {
      matchVisual: false,
    },
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'blockquote', 'code-block',
    'link', 'image',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {showPreview ? 'Preview' : 'Create New Post'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Edit' : 'Preview'}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-[#1240cc] rounded-lg hover:bg-[#001f7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {showPreview ? (
        /* Preview Mode - Exact replica of blog/[slug]/page.js */
        <div className="bg-white">
          {/* Hero Section */}
          <section className="bg-white">
            <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
              <div className="pt-24 pb-16 max-w-4xl mx-auto">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-black/60 mb-8">
                  <span>Resources</span>
                  <span>/</span>
                  <span>Blog</span>
                  {formData.category && (
                    <>
                      <span>/</span>
                      <span>
                        {formData.category.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </>
                  )}
                </div>

                <div className="text-center">
                  {formData.category && (
                    <p className="text-xs uppercase tracking-wider text-[#1240cc] mb-6">
                      {formData.category.replace(/-/g, ' ').toUpperCase()}
                    </p>
                  )}

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-black leading-[0.95] mb-6">
                    {formData.title || 'Your Post Title'}
                  </h1>

                  {formData.description && (
                    <p className="text-base md:text-lg text-black/70 leading-relaxed max-w-3xl mx-auto mb-8">
                      {formData.description}
                    </p>
                  )}

                  <div className="flex justify-center gap-8 text-sm text-black/60">
                    <span>{formData.date}</span>
                    <span>·</span>
                    <span>5 min read</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Image */}
          {formData.featuredImage && (
            <section className="bg-white">
              <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto pb-16">
                  <img
                    src={formData.featuredImage}
                    alt={formData.title}
                    className="w-full rounded-xl"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Article Content */}
          <section className="bg-white">
            <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
              <div className="max-w-5xl mx-auto pb-16">
                <div
                  className="prose prose-lg max-w-none
                    [&_h1]:text-5xl [&_h1]:font-bold [&_h1]:mb-10 [&_h1]:mt-16 [&_h1]:text-black [&_h1]:leading-tight
                    [&_h2]:text-4xl [&_h2]:font-bold [&_h2]:mb-6 [&_h2]:mt-16 [&_h2]:text-black [&_h2]:leading-tight
                    [&_h3]:text-3xl [&_h3]:font-bold [&_h3]:mb-4 [&_h3]:mt-12 [&_h3]:text-black [&_h3]:leading-snug
                    [&_h4]:text-2xl [&_h4]:font-semibold [&_h4]:mb-3 [&_h4]:mt-8 [&_h4]:text-black
                    [&_h5]:text-xl [&_h5]:font-semibold [&_h5]:mb-3 [&_h5]:mt-6 [&_h5]:text-black
                    [&_h6]:text-lg [&_h6]:font-semibold [&_h6]:mb-2 [&_h6]:mt-4 [&_h6]:text-black
                    [&_p]:text-base [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:mb-4
                    [&_a]:text-[#1240cc] [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-[#1240cc]/80
                    [&_strong]:text-black [&_strong]:font-bold
                    [&_ul]:my-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2
                    [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2
                    [&_li]:text-base [&_li]:text-gray-700 [&_li]:leading-relaxed
                    [&_blockquote]:border-l-4 [&_blockquote]:border-[#1240cc] [&_blockquote]:pl-6 [&_blockquote]:py-2 [&_blockquote]:my-6 [&_blockquote]:italic [&_blockquote]:text-gray-600
                    [&_code]:bg-gray-100 [&_code]:text-gray-900 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                    [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:my-6 [&_pre]:overflow-x-auto
                    [&_img]:rounded-lg [&_img]:shadow-lg [&_img]:my-8 [&_img]:w-full
                    [&_hr]:border-gray-300 [&_hr]:my-12
                    [&_table]:w-full [&_table]:my-8 [&_table]:border-collapse [&_table]:border [&_table]:border-gray-300
                    [&_thead]:bg-gray-50
                    [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-bold [&_th]:text-black [&_th]:text-sm [&_th]:border [&_th]:border-gray-300
                    [&_tbody]:bg-white
                    [&_td]:px-4 [&_td]:py-3 [&_td]:text-sm [&_td]:text-gray-700 [&_td]:border [&_td]:border-gray-300
                    [&_tr]:border-b [&_tr]:border-gray-200"
                  dangerouslySetInnerHTML={{ __html: formData.content || '<p>Start writing your content...</p>' }}
                />

                {/* Tags */}
                {formData.tags && (
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-black mb-4">Tagged with:</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.split(',').map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-black/70 rounded-full text-sm"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-white">
            <div className="mx-auto max-w-7xl pb-4 w-full px-4">
              <div className="p-12 text-center rounded-xl bg-[#1240cc]">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
                  Ready to improve your deliverability?
                </h2>
                <p className="text-base text-white/80 mb-8 max-w-xl mx-auto">
                  Infrabox provides everything you need to reach the inbox consistently
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://app.infrabox.software/signup"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-[#1240cc] rounded-full transition-all text-sm font-semibold"
                  >
                    Get Started
                  </a>
                  <a
                    href="/#book-call"
                    className="inline-flex items-center justify-center px-6 py-3 border border-white text-white hover:bg-white/10 rounded-full transition-all text-sm font-semibold"
                  >
                    Book a Demo
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        /* Edit Mode */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Editor - 3 columns */}
          <div className="lg:col-span-3 space-y-4">
            {/* Title */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full text-3xl font-bold text-gray-900 border-none outline-none focus:ring-0 placeholder-gray-400"
                placeholder="Enter post title..."
                required
              />
            </div>

            {/* URL Slug */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-500">/resources/blog/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  className="flex-1 text-sm text-gray-900 border-none outline-none focus:ring-0 placeholder-gray-400"
                  placeholder="url-slug"
                />
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <FileText className="w-4 h-4" />
                Description (SEO)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full text-gray-900 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#1240cc] focus:border-transparent outline-none"
                placeholder="Brief description for SEO and social sharing (recommended: 150-160 characters)..."
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  This appears in search results and social shares
                </p>
                <p className="text-xs text-gray-500">
                  {formData.description.length} / 160
                </p>
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FileText className="w-4 h-4" />
                  Article Content
                </label>
                <p className="text-xs text-gray-500 mt-1">Write your blog post content below. Use the toolbar for formatting.</p>
              </div>
              <div className="blog-editor-container" style={{ position: 'relative' }}>
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={formData.content}
                  onChange={(value) => handleChange('content', value)}
                  modules={modules}
                  formats={formats}
                  placeholder="Start writing your blog post..."
                  className={`blog-editor ${imageUploading ? 'uploading' : ''}`}
                />
                {imageUploading && (
                  <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none">
                    <div className="bg-[#1240cc] text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Uploading image...
                    </div>
                  </div>
                )}
              </div>
            </div>

            <style jsx global>{`
              .blog-editor-container {
                min-height: 600px;
              }

              .blog-editor .ql-container {
                min-height: 550px;
                font-size: 16px;
                font-family: var(--font-figtree), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              }

              .blog-editor .ql-editor {
                min-height: 550px;
                padding: 2rem;
                line-height: 1.8;
              }

              .blog-editor .ql-editor p {
                margin-bottom: 1em;
              }

              .blog-editor .ql-editor h2 {
                font-size: 1.875rem;
                font-weight: 700;
                margin-top: 2em;
                margin-bottom: 0.75em;
                line-height: 1.2;
              }

              .blog-editor .ql-editor h3 {
                font-size: 1.5rem;
                font-weight: 600;
                margin-top: 1.5em;
                margin-bottom: 0.5em;
                line-height: 1.3;
              }

              .blog-editor .ql-editor h4 {
                font-size: 1.25rem;
                font-weight: 600;
                margin-top: 1.25em;
                margin-bottom: 0.5em;
              }

              .blog-editor .ql-editor ul,
              .blog-editor .ql-editor ol {
                margin-bottom: 1em;
                padding-left: 1.5em;
              }

              .blog-editor .ql-editor li {
                margin-bottom: 0.5em;
              }

              .blog-editor .ql-editor blockquote {
                border-left: 4px solid #1240cc;
                padding-left: 1rem;
                margin: 1.5em 0;
                font-style: italic;
                color: #4b5563;
              }

              .blog-editor .ql-editor pre {
                background: #1f2937;
                color: #f3f4f6;
                padding: 1rem;
                border-radius: 0.5rem;
                margin: 1.5em 0;
                overflow-x: auto;
              }

              .blog-editor .ql-editor code {
                background: #f3f4f6;
                padding: 0.2em 0.4em;
                border-radius: 0.25rem;
                font-size: 0.9em;
              }

              .blog-editor .ql-editor a {
                color: #1240cc;
                text-decoration: underline;
              }

              .blog-editor .ql-editor img {
                max-width: 100%;
                height: auto;
                margin: 1.5em 0;
                border-radius: 0.5rem;
              }

              .blog-editor .ql-toolbar {
                border: none;
                border-bottom: 1px solid #e5e7eb;
                padding: 1rem;
                background: #f9fafb;
                position: sticky;
                top: 0;
                z-index: 10;
              }

              .blog-editor .ql-toolbar button:hover,
              .blog-editor .ql-toolbar button:focus,
              .blog-editor .ql-toolbar button.ql-active {
                color: #1240cc;
              }

              .blog-editor .ql-toolbar .ql-stroke {
                stroke: #4b5563;
              }

              .blog-editor .ql-toolbar button:hover .ql-stroke,
              .blog-editor .ql-toolbar button.ql-active .ql-stroke {
                stroke: #1240cc;
              }

              .blog-editor .ql-toolbar .ql-fill {
                fill: #4b5563;
              }

              .blog-editor .ql-toolbar button:hover .ql-fill,
              .blog-editor .ql-toolbar button.ql-active .ql-fill {
                fill: #1240cc;
              }

              /* Hide color/font pickers since we removed them */
              .blog-editor .ql-toolbar .ql-picker.ql-color,
              .blog-editor .ql-toolbar .ql-picker.ql-background,
              .blog-editor .ql-toolbar .ql-picker.ql-font,
              .blog-editor .ql-toolbar .ql-picker.ql-size,
              .blog-editor .ql-toolbar .ql-align {
                display: none;
              }

              /* Loading indicator for image upload */
              .blog-editor.uploading::after {
                content: 'Uploading image...';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(18, 64, 204, 0.9);
                color: white;
                padding: 1rem 2rem;
                border-radius: 0.5rem;
                font-size: 0.875rem;
                font-weight: 500;
                z-index: 100;
              }
            `}</style>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-4">
            {/* Status Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Status & Visibility</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.published}
                    onChange={(e) => handleChange('published', e.target.value === 'true')}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1240cc] focus:border-transparent outline-none"
                  >
                    <option value="true">✓ Published</option>
                    <option value="false">○ Draft</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-2">
                    <Calendar className="w-3 h-3" />
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1240cc] focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Author */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-3">
                <User className="w-3 h-3" />
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => handleChange('author', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1240cc] focus:border-transparent outline-none"
                placeholder="Author name"
              />
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-3">
                <Tag className="w-3 h-3" />
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1240cc] focus:border-transparent outline-none"
                placeholder="tag1, tag2, tag3"
              />
              <p className="text-xs text-gray-500 mt-2">Comma separated</p>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-3">
                <ImageIcon className="w-3 h-3" />
                Featured Image
              </label>

              {formData.featuredImage ? (
                <div className="space-y-3">
                  <img
                    src={formData.featuredImage}
                    alt="Featured"
                    className="w-full rounded-lg border border-gray-200"
                  />
                  <input
                    type="text"
                    value={formData.featuredImage}
                    onChange={(e) => handleChange('featuredImage', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1240cc] focus:border-transparent outline-none"
                    placeholder="Image URL"
                  />
                  <button
                    type="button"
                    onClick={() => handleChange('featuredImage', '')}
                    className="w-full text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                    id="image-upload"
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="block w-full px-4 py-3 text-sm text-center text-gray-700 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    {imageUploading ? 'Uploading...' : 'Upload Image'}
                  </label>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    or paste URL below
                  </p>
                  <input
                    type="text"
                    value={formData.featuredImage}
                    onChange={(e) => handleChange('featuredImage', e.target.value)}
                    className="w-full mt-2 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1240cc] focus:border-transparent outline-none"
                    placeholder="https://..."
                  />
                </div>
              )}
            </div>

            {/* SEO Keywords */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-3">
                <Globe className="w-3 h-3" />
                SEO Keywords
              </label>
              <input
                type="text"
                value={formData.seoKeywords}
                onChange={(e) => handleChange('seoKeywords', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1240cc] focus:border-transparent outline-none"
                placeholder="keyword1, keyword2"
              />
              <p className="text-xs text-gray-500 mt-2">For search optimization</p>
            </div>
          </div>
        </form>
      </div>
      )}
    </div>
  );
}
