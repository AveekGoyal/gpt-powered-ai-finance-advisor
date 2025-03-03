import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Chat from '@/models/Chat';
import User from '@/models/User';
import { generatePersonalizedFinancialAdvice } from '@/lib/openai';
import jwt from 'jsonwebtoken';

// Verifies the JWT token.
const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded;
  } catch (error) {
    return null;
  }
};

// Handles POST request to process new chat messages.
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { message, area = 'general' } = await req.json();
    const authHeader = req.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.userId;
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find or create a chat for the user
    let chat = await Chat.findOne({ user: user._id });
    if (!chat) {
      chat = new Chat({ user: user._id, messages: [] });
    }

    chat.messages.push({ role: 'user', content: message });
    const context = chat.messages.slice(-10); 

    // Generate AI response using the provided context
    const aiResponse = await generatePersonalizedFinancialAdvice(user, message, area);
    
    // Add AI response to the chat and save
    chat.messages.push({ role: 'assistant', content: aiResponse });
    await chat.save();
    
    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    console.error('Error in chat:', error);
    return NextResponse.json({ error: 'Error processing chat message' }, { status: 500 });
  }
}

// Handles GET request to fetch chat history.
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.userId;
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

// Handles DELETE request to clear chat history.
export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.userId;

    // Find and delete the chat for the user
    await Chat.findOneAndDelete({ user: userId });

    return NextResponse.json({ message: 'Chat history deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat history:', error);
    return NextResponse.json({ error: 'Error deleting chat history' }, { status: 500 });
  }
}