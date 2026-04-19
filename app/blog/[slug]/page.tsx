'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  published_at: string;
  read_time: number;
  tags?: string;
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog/posts/${params.slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading post:', error);
        setLoading(false);
      });
  }, [params.slug]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div>
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <p className="text-gray mb-4">Post not found</p>
          <Link href="/blog" className="btn-primary">
            Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray mb-6">
          <Link href="/blog" className="hover:text-primary">Blog</Link>
          <span className="mx-2">/</span>
          <Link href={`/blog?category=${post.category}`} className="hover:text-primary capitalize">
            {post.category}
          </Link>
          <span className="mx-2">/</span>
          <span>{post.title}</span>
        </nav>

        {/* Article Header */}
        <div className="mb-8">
          <span className={`badge badge-${post.category}`}>
            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
          </span>
          <h1 className="text-4xl font-bold my-4">{post.title}</h1>
          <div className="flex gap-6 text-gray text-sm">
            <span>✍️ Admin</span>
            <span>📅 {new Date(post.published_at).toLocaleDateString()}</span>
            <span>⏱️ {post.read_time} min read</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="bg-gradient-to-r from-primary to-secondary h-96 rounded-lg mb-12 flex items-center justify-center text-6xl opacity-10"></div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <ReactMarkdown
            components={{
              h1: (props) => <h1 className="text-3xl font-bold my-6 text-dark" {...props} />,
              h2: (props) => <h2 className="text-2xl font-bold my-5 text-dark" {...props} />,
              h3: (props) => <h3 className="text-xl font-bold my-4 text-dark" {...props} />,
              p: (props) => <p className="my-4 text-gray leading-relaxed" {...props} />,
              ul: (props) => <ul className="list-disc list-inside my-4 text-gray" {...props} />,
              ol: (props) => <ol className="list-decimal list-inside my-4 text-gray" {...props} />,
              li: (props) => <li className="my-2" {...props} />,
              code: (props) => (
                <code className="bg-light px-2 py-1 rounded font-mono text-sm text-primary" {...props} />
              ),
              pre: (props) => (
                <pre className="bg-dark rounded-lg p-4 overflow-x-auto my-4" {...props} />
              ),
              blockquote: (props) => (
                <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-gray" {...props} />
              ),
              a: (props) => (
                <a className="text-secondary hover:underline" {...props} />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Tags */}
        {post.tags && (
          <div className="mb-8 pb-8 border-b border-gray-200">
            <p className="text-sm text-gray mb-3">Tags:</p>
            {post.tags.split(',').map((tag) => (
              <span key={tag} className="inline-block badge badge-insight mr-2 mb-2">
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Share Buttons */}
        <div className="flex gap-4 mb-8">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(
              `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:underline text-sm"
          >
            Share on Twitter
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`
              );
              alert('Link copied!');
            }}
            className="text-secondary hover:underline text-sm"
          >
            Copy Link
          </button>
        </div>

        {/* Back to Blog */}
        <Link href="/blog" className="btn-secondary">
          ← Back to Blog
        </Link>
      </div>

      <Footer />
    </div>
  );
}
