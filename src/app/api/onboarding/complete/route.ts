// File: src/app/api/onboarding/complete/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get('Authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { annualIncome, monthlyExpenses, currentSavings, financialGoals, riskTolerance } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      {
        annualIncome,
        monthlyExpenses,
        currentSavings,
        financialGoals,
        riskTolerance,
        onboardingCompleted: true
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Onboarding completed successfully',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        annualIncome: updatedUser.annualIncome,
        monthlyExpenses: updatedUser.monthlyExpenses,
        currentSavings: updatedUser.currentSavings,
        financialGoals: updatedUser.financialGoals,
        riskTolerance: updatedUser.riskTolerance,
        onboardingCompleted: updatedUser.onboardingCompleted
      }
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ error: 'An error occurred during onboarding' }, { status: 500 });
  }
}