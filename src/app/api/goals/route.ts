import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Goal from '@/models/Goal';
import User from '@/models/User';
import { generateGoalStrategy } from '@/lib/openai';

// Handles POST request to create a new financial goal.
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { type, targetAmount, targetDate, currentAmount } = await req.json();
    const userId = req.headers.get('X-User-ID');

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create a new goal with the provided data and user ID
    const newGoal = new Goal({
      user: user._id,
      type,
      targetAmount,
      targetDate,
      currentAmount
    });

    // Generate a personalized strategy for the goal using OpenAI
    const strategy = await generateGoalStrategy(user, newGoal); 
    newGoal.strategy = strategy;
    
    // Calculate initial progress
    newGoal.progress = (newGoal.currentAmount / newGoal.targetAmount) * 100; 

    await newGoal.save();
    return NextResponse.json(newGoal, { status: 201 });
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json({ error: 'Error creating goal' }, { status: 500 });
  }
}

// Handles GET request to fetch all goals for the user.
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const userId = req.headers.get('X-User-ID');

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Fetch all goals for the user
    const goals = await Goal.find({ user: userId });
    return NextResponse.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json({ error: 'Error fetching goals' }, { status: 500 });
  }
}