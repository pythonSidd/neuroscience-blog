import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { messagingDb } from '@/lib/db';
import { generateBlogFromIdea } from '@/lib/ai';

const twilioWebhookToken = process.env.TWILIO_WEBHOOK_TOKEN || '';

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-twilio-signature') || '';
    const body = await request.text();

    if (!signature && !twilioWebhookToken) {
      console.warn('Warning: Twilio webhook token not configured');
    }

    const formData = new URLSearchParams(body);
    const from = formData.get('From');
    const messageBody = formData.get('Body');
    const messageId = formData.get('MessageSid');

    if (!from || !messageBody || !messageId) {
      console.error('Missing required WhatsApp fields');
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    console.log(`WhatsApp message received from ${from}: ${messageBody}`);

    const ideaId = await messagingDb.create({
      platform: 'whatsapp',
      platform_message_id: messageId,
      sender_id: from,
      original_message: messageBody,
      status: 'pending_ai_generation',
    });

    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID || '',
      process.env.TWILIO_AUTH_TOKEN || ''
    );

    await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER || '',
      to: from,
      body: '📝 Thanks! Your blog idea is being processed. I\'ll review it and let you know when it\'s published!',
    });

    try {
      const generated = await generateBlogFromIdea(messageBody);
      await messagingDb.update(ideaId, {
        ai_generated_title: generated.title,
        ai_generated_content: generated.content,
        status: 'pending_review',
        processed_at: new Date().toISOString(),
      });

      console.log(`✅ Blog draft generated for idea ${ideaId}`);

      await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER || '',
        to: from,
        body: '✅ Your blog draft is ready! Admin will review and publish it soon.',
      });
    } catch (error) {
      console.error('Error generating blog draft:', error);
      await messagingDb.update(ideaId, {
        status: 'pending_review',
        admin_notes: 'AI generation failed - needs manual review',
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'WhatsApp webhook is running' });
}
