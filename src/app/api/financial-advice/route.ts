// File: src/app/api/financial-advice/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import FinancialAdvice from '@/models/FinancialAdvice';
import { generatePersonalizedFinancialAdvice } from '@/lib/openai';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { question, area } = await req.json();

    // Get user ID from the header set by the middleware
    const userId = req.headers.get('X-User-ID');
    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const advice = await generatePersonalizedFinancialAdvice(user, question, area);

    const newAdvice = new FinancialAdvice({
      user: user._id,
      question,
      area,
      advice
    });

    await newAdvice.save();

    return NextResponse.json({ advice });
  } catch (error) {
    console.error('Error generating financial advice:', error);
    return NextResponse.json({ error: 'Error generating financial advice' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    // Get user ID from the header set by the middleware
    const userId = req.headers.get('X-User-ID');
    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const adviceHistory = await FinancialAdvice.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json(adviceHistory);
  } catch (error) {
    console.error('Error fetching advice history:', error);
    return NextResponse.json({ error: 'Error fetching advice history' }, { status: 500 });
  }
}