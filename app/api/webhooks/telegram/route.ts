import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { messagingDb } from '@/lib/db';
import { generateBlogFromIdea } from '@/lib/ai';

const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
const telegramApiUrl = `https://api.telegram.org/bot${botToken}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.message && body.message.text) {
      const message = body.message;
      const from = message.from;
      const messageText = message.text;
      const messageId = message.message_id;
      const chatId = message.chat.id;

      console.log(`Telegram message received from ${from.username || from.id}: ${messageText}`);

      const ideaId = await messagingDb.create({
        platform: 'telegram',
        platform_message_id: messageId.toString(),
        sender_id: from.id.toString(),
        sender_name: from.first_name + (from.last_name ? ` ${from.last_name}` : ''),
        original_message: messageText,
        status: 'pending_ai_generation',
      });

      await sendTelegramMessage(chatId,
        '📝 Thanks! Your blog idea is being processed. I\'ll review it and let you know when it\'s published!');

      try {
        const generated = await generateBlogFromIdea(messageText);
        await messagingDb.update(ideaId, {
          ai_generated_title: generated.title,
          ai_generated_content: generated.content,
          status: 'pending_review',
          processed_at: new Date().toISOString(),
        });

        console.log(`✅ Blog draft generated for idea ${ideaId}`);

        await sendTelegramMessage(chatId,
          '✅ Your blog draft is ready! Admin will review and publish it soon.');
      } catch (error) {
        console.error('Error generating blog draft:', error);
        await messagingDb.update(ideaId, {
          status: 'pending_review',
          admin_notes: 'AI generation failed - needs manual review',
        });

        await sendTelegramMessage(chatId,
          '⚠️ There was an issue generating your draft. Admin will handle it manually.');
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendTelegramMessage(chatId: number, text: string) {
  try {
    await axios.post(`${telegramApiUrl}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    });
  } catch (error) {
    console.error('Error sending Telegram message:', error);
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Telegram webhook is running' });
}
