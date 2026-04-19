'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface MessagingIdea {
  id: number;
  platform: string;
  sender_id: string;
  sender_name?: string;
  original_message: string;
  status: string;
  ai_generated_title?: string;
  ai_generated_content?: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<MessagingIdea[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const router = useRouter();

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

    let url = '/api/admin/messaging-ideas';
    if (selectedPlatform !== 'all') {
      url += `?platform=${selectedPlatform}`;
    }

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setIdeas(data.ideas || []);
        setLoading(false);
      });
  }, [token, selectedPlatform]);

  const handlePublish = async (id: number) => {
    if (!token) return;

    const idea = ideas.find((i) => i.id === id);
    if (!idea || !idea.ai_generated_title || !idea.ai_generated_content) {
      alert('Title and content are required');
      return;
    }

    try {
      const response = await fetch('/api/admin/messaging-ideas', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          status: 'published',
          publish: true,
          ai_generated_title: idea.ai_generated_title,
          ai_generated_content: idea.ai_generated_content,
        }),
      });

      if (response.ok) {
        alert('✅ Blog published!');
        setIdeas(ideas.filter((i) => i.id !== id));
      }
    } catch (error) {
      alert('Error publishing blog');
    }
  };

  const handleReject = async (id: number) => {
    if (!token || !confirm('Are you sure you want to reject this idea?')) return;

    try {
      const response = await fetch('/api/admin/messaging-ideas', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status: 'rejected' }),
      });

      if (response.ok) {
        setIdeas(ideas.filter((i) => i.id !== id));
      }
    } catch (error) {
      alert('Error rejecting idea');
    }
  };

  const handleEditSave = async (id: number) => {
    if (!token) return;

    try {
      const response = await fetch('/api/admin/messaging-ideas', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          ai_generated_title: editTitle,
          ai_generated_content: editContent,
        }),
      });

      if (response.ok) {
        setIdeas(ideas.map((i) => 
          i.id === id 
            ? { ...i, ai_generated_title: editTitle, ai_generated_content: editContent }
            : i
        ));
        setEditingId(null);
      }
    } catch (error) {
      alert('Error saving changes');
    }
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-dark text-white p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">🧠 Admin Panel</h1>
        <button onClick={handleLogout} className="bg-accent px-4 py-2 rounded hover:bg-amber-700">
          Logout
        </button>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-light border-b border-gray-300 px-8 py-4 flex gap-4">
        <button className="text-primary font-semibold border-b-2 border-primary pb-2">
          💬 Messaging Ideas
        </button>
        <a href="/admin/blog" className="text-gray hover:text-dark pb-2 transition">
          📝 Blog Posts
        </a>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-primary mb-2">25</div>
            <p className="text-gray">Published Posts</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-secondary mb-2">3</div>
            <p className="text-gray">Drafts</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-accent mb-2">{ideas.length}</div>
            <p className="text-gray">Pending Ideas</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-success mb-2">8</div>
            <p className="text-gray">Research Papers</p>
          </div>
        </div>

        {/* Messaging Ideas */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6">💬 Pending Messaging Ideas</h2>

          {/* Platform Filter */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setSelectedPlatform('all')}
              className={`px-4 py-2 rounded ${
                selectedPlatform === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-light text-dark hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedPlatform('whatsapp')}
              className={`px-4 py-2 rounded ${
                selectedPlatform === 'whatsapp'
                  ? 'bg-primary text-white'
                  : 'bg-light text-dark hover:bg-gray-300'
              }`}
            >
              📱 WhatsApp
            </button>
            <button
              onClick={() => setSelectedPlatform('telegram')}
              className={`px-4 py-2 rounded ${
                selectedPlatform === 'telegram'
                  ? 'bg-primary text-white'
                  : 'bg-light text-dark hover:bg-gray-300'
              }`}
            >
              ✈️ Telegram
            </button>
          </div>

          {/* Ideas List */}
          {ideas.length === 0 ? (
            <p className="text-center text-gray py-8">No pending ideas</p>
          ) : (
            <div className="space-y-6">
              {ideas.map((idea) => (
                <div key={idea.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Header */}
                  <div className="bg-light p-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`inline-block px-3 py-1 rounded text-white text-sm font-semibold mr-3 ${
                          idea.platform === 'whatsapp' ? 'bg-green-600' : 'bg-blue-600'
                        }`}>
                          {idea.platform === 'whatsapp' ? '📱' : '✈️'} {idea.platform.toUpperCase()}
                        </span>
                        <div className="mt-2">
                          <p className="text-sm text-gray">
                            {idea.sender_name || idea.sender_id}
                          </p>
                          <p className="text-xs text-gray">
                            {new Date(idea.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4 bg-light p-3 rounded italic border-l-4 border-gray">
                      <p className="text-xs font-semibold text-gray mb-1">Original Message:</p>
                      <p>{idea.original_message}</p>
                    </div>

                    {editingId === idea.id ? (
                      <>
                        <div className="mb-4">
                          <label className="block font-semibold mb-2">Title:</label>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block font-semibold mb-2">Content (Markdown):</label>
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded h-64"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditSave(idea.id)}
                            className="btn-success"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mb-4">
                          <p className="font-semibold text-primary text-lg">
                            {idea.ai_generated_title || 'Title not generated yet'}
                          </p>
                          <p className="text-sm text-gray mt-1">
                            {idea.ai_generated_content ? (
                              <>Preview: {idea.ai_generated_content.substring(0, 200)}...</>
                            ) : (
                              'Content not generated yet'
                            )}
                          </p>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => {
                              setEditingId(idea.id);
                              setEditTitle(idea.ai_generated_title || '');
                              setEditContent(idea.ai_generated_content || '');
                            }}
                            className="px-4 py-2 bg-secondary text-white rounded hover:bg-blue-700"
                          >
                            ✎ Edit
                          </button>
                          <button
                            onClick={() => handlePublish(idea.id)}
                            className="btn-success"
                          >
                            ✓ Publish
                          </button>
                          <button
                            onClick={() => handleReject(idea.id)}
                            className="btn-danger"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
