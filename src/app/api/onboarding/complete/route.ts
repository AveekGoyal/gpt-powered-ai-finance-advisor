import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

// Handles PUT request to update user data during onboarding.
export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get('Authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    let decoded;
    try {
      // Verify the JWT token
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { annualIncome, monthlyExpenses, currentSavings, financialGoals, riskTolerance } = await req.json();

    // Update user data with onboarding information
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

    // Return the updated user data
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