// File: src/app/api/auth/register/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { username, email, password } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'EMAIL_EXISTS', message: 'This email is already registered' }, { status: 400 });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    console.log('User registered:', newUser);

    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        onboardingCompleted: newUser.onboardingCompleted
      },
      token
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'REGISTRATION_FAILED', message: 'Registration failed' }, { status: 500 });
  }
}