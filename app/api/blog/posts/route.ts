import { NextRequest, NextResponse } from 'next/server';
import { blogDb } from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';
import slug from 'slug';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || undefined;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const isAdmin = verifyAdminToken(request);
    const includeAll = !!isAdmin;

    const posts = await blogDb.getAll(limit, offset, category, includeAll);
    const total = isAdmin
      ? (await blogDb.count('draft')) + (await blogDb.count('published')) + (await blogDb.count('archived'))
      : await blogDb.count('published');

    return NextResponse.json({
      posts,
      pagination: { total, limit, offset },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, excerpt, category, featured_image_url, tags, status = 'draft' } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      );
    }

    const postSlug = slug(title);
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    const postId = await blogDb.create({
      title,
      slug: postSlug,
      content,
      excerpt: excerpt || content.substring(0, 150),
      category: category as 'research' | 'tutorial' | 'insight',
      featured_image_url,
      status: status as 'draft' | 'published' | 'archived',
      tags,
      read_time: readTime,
      author: 'Admin',
      published_at: status === 'published' ? new Date().toISOString() : undefined,
    });

    const post = await blogDb.getById(postId);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
