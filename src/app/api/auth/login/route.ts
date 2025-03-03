import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Handles POST request for user login.
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'EMAIL_NOT_FOUND', message: 'This email is not registered' }, { status: 400 });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: 'INVALID_PASSWORD', message: 'Incorrect password' }, { status: 400 });
    }

    // Generate JWT 
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    // Return user data and JWT
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