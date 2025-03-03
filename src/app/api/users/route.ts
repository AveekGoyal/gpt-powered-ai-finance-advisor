import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

// Handles POST request for user registration.
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { username, email, password } = await req.json();

    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'EMAIL_EXISTS', message: 'This email is already registered' }, { status: 400 });
    }

    // Create a new user and save it to the database
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Generate JWT 
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    // Return user data and JWT
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