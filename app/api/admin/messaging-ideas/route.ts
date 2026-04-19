import { NextRequest, NextResponse } from 'next/server';
import { messagingDb, blogDb } from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';
import slug from 'slug';
import axios from 'axios';
import twilio from 'twilio';

export async function GET(request: NextRequest) {
  try {
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get('platform') || undefined;
    const status = searchParams.get('status') || undefined;

    let ideas = messagingDb.getPending(platform || undefined);

    if (status) {
      ideas = ideas.filter((idea) => idea.status === status);
    }

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error('Error fetching messaging ideas:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, status, ai_generated_title, ai_generated_content, publish = false } = body;

    const idea = messagingDb.getById(id);
    if (!idea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      );
    }

    if (status === 'rejected') {
      messagingDb.update(id, { status: 'rejected' });
      
      // Send rejection message via platform
      await sendMessageToUser(idea.platform, idea.sender_id, 
        '❌ Your blog idea wasn\'t approved this time. Thanks for the suggestion!');
      
      return NextResponse.json({ success: true });
    }

    if (publish) {
      if (!ai_generated_title || !ai_generated_content) {
        return NextResponse.json(
          { error: 'Title and content are required to publish' },
          { status: 400 }
        );
      }

      const postSlug = slug(ai_generated_title);
      const wordCount = ai_generated_content.split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200);

      const postId = blogDb.create({
        title: ai_generated_title,
        slug: postSlug,
        content: ai_generated_content,
        excerpt: ai_generated_content.substring(0, 150),
        category: 'insight',
        status: 'published',
        read_time: readTime,
      });

      messagingDb.update(id, {
        status: 'published',
        published_at: new Date().toISOString(),
        related_blog_post_id: postId as number,
      });

      // Send success message
      const blogUrl = `${process.env.NEXT_PUBLIC_APP_URL}/blog/${postSlug}`;
      await sendMessageToUser(idea.platform, idea.sender_id,
        `🎉 Your blog post is live!\n\nRead it here: ${blogUrl}`);

      return NextResponse.json({ success: true, postId });
    }

    // Just update the content
    messagingDb.update(id, {
      ai_generated_title: ai_generated_title || idea.ai_generated_title,
      ai_generated_content: ai_generated_content || idea.ai_generated_content,
      status: status || idea.status,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating messaging idea:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendMessageToUser(
  platform: string,
  senderId: string,
  message: string
) {
  try {
    if (platform === 'whatsapp') {
      const twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID || '',
        process.env.TWILIO_AUTH_TOKEN || ''
      );

      await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER || '',
        to: senderId,
        body: message,
      });
    } else if (platform === 'telegram') {
      const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
      const telegramApiUrl = `https://api.telegram.org/bot${botToken}`;

      await axios.post(`${telegramApiUrl}/sendMessage`, {
        chat_id: parseInt(senderId),
        text: message,
      });
    }
  } catch (error) {
    console.error('Error sending message to user:', error);
  }
}
