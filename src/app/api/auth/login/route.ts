// File: src/app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    console.log('Login attempt for email:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return NextResponse.json({ error: 'EMAIL_NOT_FOUND', message: 'This email is not registered' }, { status: 400 });
    }

    console.log('User found:', user);
    console.log('Stored hashed password:', user.password);
    console.log('Provided password:', password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log('Password mismatch for user:', user.email);
      return NextResponse.json({ error: 'INVALID_PASSWORD', message: 'Incorrect password' }, { status: 400 });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    console.log('Login successful for user:', user.email);

    return NextResponse.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        onboardingCompleted: user.onboardingCompleted,
        annualIncome: user.annualIncome,
        monthlyExpenses: user.monthlyExpenses,
        currentSavings: user.currentSavings,
        financialGoals: user.financialGoals,
        riskTolerance: user.riskTolerance
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'LOGIN_FAILED', message: 'Login failed' }, { status: 500 });
  }
}