import { NextRequest, NextResponse } from 'next/server';
import { blogDb } from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = blogDb.getBySlug(params.slug);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const post = blogDb.getBySlug(params.slug);
    if (!post || !post.id) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    blogDb.update(post.id, {
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      category: body.category,
      featured_image_url: body.featured_image_url,
      status: body.status,
      tags: body.tags,
      published_at: body.status === 'published' && !post.published_at ? new Date().toISOString() : undefined,
    });

    const updated = blogDb.getById(post.id);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const post = blogDb.getBySlug(params.slug);
    if (!post || !post.id) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    blogDb.delete(post.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
