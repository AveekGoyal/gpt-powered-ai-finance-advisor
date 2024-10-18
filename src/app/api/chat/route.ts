// File: src/app/api/chat/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Chat from '@/models/Chat';
import User from '@/models/User';
import { generateChatResponse } from '@/lib/openai';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { message } = await req.json();
    const userId = req.headers.get('X-User-ID');

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let chat = await Chat.findOne({ user: user._id });
    if (!chat) {
      chat = new Chat({ user: user._id, messages: [] });
    }

    chat.messages.push({ role: 'user', content: message });

    // Get the last 10 messages (or all if less than 10) to provide context
    const context = chat.messages.slice(-10);

    const aiResponse = await generateChatResponse(context);

    chat.messages.push({ role: 'assistant', content: aiResponse });
    await chat.save();

    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    console.error('Error in chat:', error);
    return NextResponse.json({ error: 'Error processing chat message' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const userId = req.headers.get('X-User-ID');

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const chat = await Chat.findOne({ user: userId });

    if (!chat) {
      return NextResponse.json({ chatHistory: [] });
    }

    return NextResponse.json({ chatHistory: chat.messages });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json({ error: 'Error fetching chat history' }, { status: 500 });
  }
}