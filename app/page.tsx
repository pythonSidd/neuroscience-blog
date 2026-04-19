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

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog/posts?limit=3')
      .then((res) => res.json())
      .then((data) => {
        setFeaturedPosts(data.posts || []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-dark mb-4">Exploring the Brain</h1>
          <p className="text-xl text-gray mb-8">
            A high schooler's journey into neuroscience, research, and discovery
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/blog" className="btn-primary">
              📖 Read Latest Blog
            </Link>
            <Link href="/research" className="btn-secondary">
              🔬 Explore Research
            </Link>
          </div>
          <div className="mt-12 bg-gradient-to-br from-primary to-secondary h-80 rounded-2xl flex items-center justify-center text-white text-2xl font-semibold mx-auto" style={{maxWidth: '500px'}}>
            🧠 Brain Illustration
          </div>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="bg-light py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="section-title">Latest Blog Posts</h2>
          <p className="section-subtitle">Discover insights into neuroscience, research, and AI</p>
          
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <div key={post.id} className="card">
                  <div className="bg-gradient-to-br from-primary to-secondary h-48 flex items-center justify-center text-5xl">
                    {post.category === 'research' && '🧬'}
                    {post.category === 'tutorial' && '📚'}
                    {post.category === 'insight' && '💡'}
                  </div>
                  <div className="p-6">
                    <span className={`badge badge-${post.category}`}>
                      {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                    </span>
                    <h3 className="text-xl font-bold mt-3 mb-2">{post.title}</h3>
                    <div className="flex gap-4 text-sm text-gray mb-4">
                      <span>📅 {new Date(post.published_at).toLocaleDateString()}</span>
                      <span>⏱️ {post.read_time} min read</span>
                    </div>
                    <p className="text-gray mb-4">{post.excerpt}</p>
                    <Link href={`/blog/${post.slug}`} className="text-accent font-semibold hover:text-amber-700">
                      → Read Article
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Research Papers */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="section-title">📄 Research Publications</h2>
          <p className="section-subtitle">My published papers and research contributions</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card">
              <div className="bg-gradient-to-br from-primary to-secondary h-48 flex items-center justify-center text-5xl">📚</div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Neural Mechanisms of Memory Formation</h3>
                <div className="flex gap-4 text-sm text-gray mb-4">
                  <span>2025</span>
                  <span>Journal of Neuroscience</span>
                </div>
                <p className="text-gray mb-4">Investigating the molecular basis of long-term memory consolidation through experimental and computational approaches...</p>
                <Link href="/research" className="text-accent font-semibold hover:text-amber-700">📥 View Paper</Link>
              </div>
            </div>
            <div className="card">
              <div className="bg-gradient-to-br from-primary to-secondary h-48 flex items-center justify-center text-5xl">📚</div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">ADHD and Attention Networks</h3>
                <div className="flex gap-4 text-sm text-gray mb-4">
                  <span>2025</span>
                  <span>Brain Research Review</span>
                </div>
                <p className="text-gray mb-4">A meta-analysis of fMRI studies examining attention network dysfunction in ADHD populations...</p>
                <Link href="/research" className="text-accent font-semibold hover:text-amber-700">📥 View Paper</Link>
              </div>
            </div>
            <div className="card">
              <div className="bg-gradient-to-br from-primary to-secondary h-48 flex items-center justify-center text-5xl">📚</div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Sleep and Neuroplasticity</h3>
                <div className="flex gap-4 text-sm text-gray mb-4">
                  <span>2024</span>
                  <span>Sleep Science Quarterly</span>
                </div>
                <p className="text-gray mb-4">Exploring the role of REM and NREM sleep stages in synaptic pruning and memory consolidation...</p>
                <Link href="/research" className="text-accent font-semibold hover:text-amber-700">📥 View Paper</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GitHub Projects */}
      <section className="bg-light py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="section-title">💻 GitHub Projects</h2>
          <p className="section-subtitle">Open-source projects and code repositories</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card">
              <div className="bg-gradient-to-br from-primary to-secondary h-48 flex items-center justify-center text-5xl">🐍</div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Neurotransmitter Simulator</h3>
                <div className="flex gap-4 text-sm text-gray mb-4">
                  <span>Python · PyTorch</span>
                  <span>⭐ 45</span>
                </div>
                <p className="text-gray mb-4">Simulate neural signal transmission with realistic neurotransmitter dynamics and learning rules...</p>
                <Link href="/projects" className="text-accent font-semibold hover:text-amber-700">→ View on GitHub</Link>
              </div>
            </div>
            <div className="card">
              <div className="bg-gradient-to-br from-primary to-secondary h-48 flex items-center justify-center text-5xl">📊</div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">EEG Analysis Toolkit</h3>
                <div className="flex gap-4 text-sm text-gray mb-4">
                  <span>Python · Jupyter</span>
                  <span>⭐ 28</span>
                </div>
                <p className="text-gray mb-4">Comprehensive toolkit for analyzing and visualizing EEG data with spectral analysis and component extraction...</p>
                <Link href="/projects" className="text-accent font-semibold hover:text-amber-700">→ View on GitHub</Link>
              </div>
            </div>
            <div className="card">
              <div className="bg-gradient-to-br from-primary to-secondary h-48 flex items-center justify-center text-5xl">🧠</div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Brain Atlas Visualizer</h3>
                <div className="flex gap-4 text-sm text-gray mb-4">
                  <span>JavaScript · Three.js</span>
                  <span>⭐ 15</span>
                </div>
                <p className="text-gray mb-4">Interactive 3D brain atlas with region-specific information, connectivity visualization, and educational features...</p>
                <Link href="/projects" className="text-accent font-semibold hover:text-amber-700">→ View on GitHub</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-light py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-primary to-secondary w-64 h-64 rounded-lg mx-auto"></div>
            <div>
              <h2 className="text-3xl font-bold mb-4">About Me</h2>
              <p className="text-gray mb-4">
                I'm a high school student deeply passionate about neuroscience, brain research, and the intersection of AI and biology. 
                Through this platform, I share my learning journey, research insights, and coding projects.
              </p>
              <p className="text-gray mb-6">
                My interests span from synaptic plasticity and memory to AI-powered brain analysis. I'm constantly exploring new 
                research, contributing to open-source projects, and writing about discoveries in neuroscience.
              </p>
              <Link href="/about" className="btn-primary">
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-3xl font-bold mb-12">By the Numbers</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border-l-4 border-primary text-center">
              <div className="text-4xl font-bold text-primary mb-2">25+</div>
              <p className="text-gray">Blog Posts Published</p>
            </div>
            <div className="bg-white p-6 rounded-lg border-l-4 border-secondary text-center">
              <div className="text-4xl font-bold text-secondary mb-2">8</div>
              <p className="text-gray">Research Papers</p>
            </div>
            <div className="bg-white p-6 rounded-lg border-l-4 border-accent text-center">
              <div className="text-4xl font-bold text-accent mb-2">15+</div>
              <p className="text-gray">GitHub Projects</p>
            </div>
            <div className="bg-white p-6 rounded-lg border-l-4 border-success text-center">
              <div className="text-4xl font-bold text-success mb-2">1000+</div>
              <p className="text-gray">Monthly Visitors</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
