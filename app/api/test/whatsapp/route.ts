import { NextRequest, NextResponse } from 'next/server';
import { messagingDb, blogDb } from '@/lib/db';
import { generateBlogFromIdea } from '@/lib/ai';
import slug from 'slug';

// Test-only endpoint — bypasses Twilio signature verification
export async function POST(request: NextRequest) {
  try {
    const { message, sender = 'whatsapp:+10000000000' } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    const messageId = `test_${Date.now()}`;

    const ideaId = await messagingDb.create({
      platform: 'whatsapp',
      platform_message_id: messageId,
      sender_id: sender,
      original_message: message,
      status: 'pending_ai_generation',
    });

    console.log(`[TEST] Stored idea #${ideaId}, calling Claude...`);

    const generated = await generateBlogFromIdea(message);

    await messagingDb.update(ideaId, {
      ai_generated_title: generated.title,
      ai_generated_content: generated.content,
      status: 'pending_review',
      processed_at: new Date().toISOString(),
    });

    const postId = await blogDb.create({
      title: generated.title,
      slug: slug(generated.title),
      content: generated.content,
      excerpt: generated.excerpt,
      category: generated.category,
      status: 'published',
      author: 'Claude AI (via WhatsApp)',
      read_time: generated.readTime,
    });

    await messagingDb.update(ideaId, {
      status: 'published',
      related_blog_post_id: postId,
    });

    return NextResponse.json({
      success: true,
      idea_id: ideaId,
      post_id: postId,
      title: generated.title,
      category: generated.category,
      read_time: generated.readTime,
      excerpt: generated.excerpt,
      slug: slug(generated.title),
    });
  } catch (error: any) {
    console.error('[TEST] WhatsApp simulation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
