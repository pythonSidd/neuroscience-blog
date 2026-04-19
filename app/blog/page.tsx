'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  published_at: string;
  read_time: number;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let url = '/api/blog/posts?limit=20';
    if (category) {
      url += `&category=${category}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        setLoading(false);
      });
  }, [category]);

  return (
    <div>
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Blog</h1>
        <p className="text-gray mb-8">Discover insights into neuroscience, research, and AI</p>

        {/* Sidebar & Content */}
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="card p-6">
              <h3 className="font-bold mb-4">Categories</h3>
              <button
                onClick={() => setCategory(null)}
                className={`block w-full text-left py-2 px-3 rounded mb-2 ${
                  category === null ? 'bg-primary text-white' : 'hover:bg-light'
                }`}
              >
                All Posts
              </button>
              <button
                onClick={() => setCategory('research')}
                className={`block w-full text-left py-2 px-3 rounded mb-2 ${
                  category === 'research' ? 'bg-primary text-white' : 'hover:bg-light'
                }`}
              >
                Research
              </button>
              <button
                onClick={() => setCategory('tutorial')}
                className={`block w-full text-left py-2 px-3 rounded mb-2 ${
                  category === 'tutorial' ? 'bg-primary text-white' : 'hover:bg-light'
                }`}
              >
                Tutorials
              </button>
              <button
                onClick={() => setCategory('insight')}
                className={`block w-full text-left py-2 px-3 rounded ${
                  category === 'insight' ? 'bg-primary text-white' : 'hover:bg-light'
                }`}
              >
                Insights
              </button>
            </div>
          </div>

          {/* Posts */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="text-center py-10">Loading...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-10 text-gray">No posts found</div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="card p-6 hover:shadow-lg transition">
                    <Link href={`/blog/${post.slug}`} className="group">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className={`badge badge-${post.category}`}>
                            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                          </span>
                          <h2 className="text-2xl font-bold mt-3 group-hover:text-primary transition">
                            {post.title}
                          </h2>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm text-gray mb-4">
                        <span>📅 {new Date(post.published_at).toLocaleDateString()}</span>
                        <span>⏱️ {post.read_time} min read</span>
                      </div>
                      <p className="text-gray mb-4">{post.excerpt}</p>
                      <span className="text-accent font-semibold group-hover:text-amber-700 transition">
                        → Read Article
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
