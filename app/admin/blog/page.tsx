'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image_url?: string;
  category: string;
  status: string;
  author: string;
  tags: string;
  read_time: number;
  created_at: string;
  published_at?: string;
}

export default function AdminBlogEditor() {
  const [token, setToken] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image_url: '',
    category: 'insight',
    status: 'draft',
    author: '',
    tags: '',
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (!storedToken) {
      router.push('/admin/login');
      return;
    }
    setToken(storedToken);
  }, [router]);

  useEffect(() => {
    if (!token) return;
    fetchPosts();
  }, [token]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts?limit=100', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setPosts(data.posts || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!formData.title || !formData.content) {
      alert('Title and content are required');
      return;
    }

    try {
      const url = editingId
        ? `/api/blog/posts/${posts.find((p) => p.id === editingId)?.slug}`
        : '/api/blog/posts';

      const method = editingId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(editingId ? '✅ Post updated!' : '✅ Post created!');
        setFormData({
          title: '',
          content: '',
          excerpt: '',
          featured_image_url: '',
          category: 'insight',
          status: 'draft',
          author: '',
          tags: '',
        });
        setShowNewForm(false);
        setEditingId(null);
        fetchPosts();
      } else {
        alert('Error saving post');
      }
    } catch (error) {
      alert('Error saving post');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!token || !confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/blog/posts/${slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert('✅ Post deleted!');
        fetchPosts();
      }
    } catch (error) {
      alert('Error deleting post');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      featured_image_url: post.featured_image_url || '',
      category: post.category,
      status: post.status,
      author: post.author,
      tags: post.tags || '',
    });
    setEditingId(post.id);
    setShowNewForm(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (!token) {
    return <div>Redirecting to login...</div>;
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-dark text-white p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">📝 Blog Editor</h1>
          <p className="text-sm text-light mt-1">Create and manage blog posts</p>
        </div>
        <button onClick={handleLogout} className="bg-accent px-4 py-2 rounded hover:bg-amber-700">
          Logout
        </button>
      </header>

      <div className="max-w-7xl mx-auto p-8">
        {/* Create New Post Button */}
        <div className="mb-8">
          {!showNewForm && (
            <button
              onClick={() => {
                setShowNewForm(true);
                setEditingId(null);
                setFormData({
                  title: '',
                  content: '',
                  excerpt: '',
                  featured_image_url: '',
                  category: 'insight',
                  status: 'draft',
                  author: '',
                  tags: '',
                });
              }}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-800 transition"
            >
              + New Blog Post
            </button>
          )}
        </div>

        {/* New/Edit Form */}
        {showNewForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-primary">
            <h2 className="text-2xl font-bold text-dark mb-6">
              {editingId ? '✎ Edit Post' : '+ Create New Post'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block font-semibold text-dark mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., How the Brain Learns Through Repetition"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block font-semibold text-dark mb-2">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary for blog listing (auto-generated if empty)"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg h-20 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block font-semibold text-dark mb-2">Content (Markdown) *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="# Heading&#10;&#10;Write your content in Markdown...&#10;&#10;- Bullet points&#10;- Supported&#10;&#10;**Bold** and *italic* text&#10;&#10;```code blocks```"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg h-96 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray mt-2">💡 Supports Markdown: headings, lists, bold, italic, code blocks, links, and more</p>
              </div>

              {/* Featured Image */}
              <div>
                <label className="block font-semibold text-dark mb-2">Featured Image URL</label>
                <input
                  type="text"
                  value={formData.featured_image_url}
                  onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block font-semibold text-dark mb-2">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="e.g., Your Name"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block font-semibold text-dark mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="neuroscience, learning, brain"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <label className="block font-semibold text-dark mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="research">📚 Research</option>
                    <option value="tutorial">📖 Tutorial</option>
                    <option value="insight">💡 Insight</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block font-semibold text-dark mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="draft">📝 Draft</option>
                    <option value="published">✅ Published</option>
                    <option value="archived">📦 Archived</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-800 transition"
                >
                  {editingId ? '✓ Update Post' : '+ Create Post'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewForm(false);
                    setEditingId(null);
                  }}
                  className="px-6 py-2 bg-gray-300 text-dark rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search & Filter */}
        {!showNewForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="🔍 Search posts by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-2">
                {['all', 'published', 'draft', 'archived'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      filterStatus === status
                        ? 'bg-primary text-white'
                        : 'bg-light text-dark hover:bg-gray-300'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Posts List */}
        {!showNewForm && (
          <div>
            <h2 className="text-2xl font-bold text-dark mb-6">
              {filteredPosts.length} {filterStatus === 'all' ? 'Posts' : `${filterStatus} Posts`}
            </h2>

            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray text-lg">No posts found</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              post.status === 'published'
                                ? 'bg-green-100 text-green-700'
                                : post.status === 'draft'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {post.status === 'published' ? '✅' : post.status === 'draft' ? '📝' : '📦'}
                            {' '}
                            {post.status.toUpperCase()}
                          </span>
                          <span className="text-xs px-3 py-1 bg-light text-dark rounded-full font-semibold">
                            {post.category}
                          </span>
                          <span className="text-xs text-gray">📖 {post.read_time} min read</span>
                        </div>
                        <h3 className="text-lg font-bold text-dark mb-2">{post.title}</h3>
                        <p className="text-sm text-gray mb-3">
                          {post.excerpt || post.content.substring(0, 120) + '...'}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags &&
                            post.tags.split(',').map((tag) => (
                              <span key={tag} className="text-xs bg-light px-2 py-1 rounded">
                                #{tag.trim()}
                              </span>
                            ))}
                        </div>
                        <p className="text-xs text-gray">
                          Created: {new Date(post.created_at).toLocaleDateString()}
                          {post.published_at && ` • Published: ${new Date(post.published_at).toLocaleDateString()}`}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="px-3 py-1 bg-secondary text-white text-sm rounded hover:bg-blue-700 transition"
                        >
                          ✎ Edit
                        </button>
                        {post.status === 'published' && (
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-purple-800 transition text-center"
                          >
                            👁 View
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(post.slug)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
