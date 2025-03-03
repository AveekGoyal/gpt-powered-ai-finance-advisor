import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import FinancialSnapshot from '@/models/FinancialSnapshot';

// Handles POST request to create a new financial snapshot.
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const snapshotData = await req.json();
    const userId = req.headers.get('X-User-ID');

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Create a new financial snapshot with the provided data and user ID
    const newSnapshot = new FinancialSnapshot({
      ...snapshotData,
      user: userId
    });

    await newSnapshot.save();
    return NextResponse.json(newSnapshot, { status: 201 });
  } catch (error) {
    console.error('Error creating financial snapshot:', error);
    return NextResponse.json({ error: 'Error creating financial snapshot' }, { status: 500 });
  }
}

// Handles GET request to fetch the latest financial snapshot for the user.
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const userId = req.headers.get('X-User-ID');

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Fetch the latest snapshot for the user, sorted by creation date in descending order
    const snapshot = await FinancialSnapshot.findOne({ user: userId }).sort('-createdAt');

    if (!snapshot) {
      return NextResponse.json({ error: 'No financial snapshot found' }, { status: 404 });
    }

    return NextResponse.json(snapshot);
  } catch (error) {
    console.error('Error fetching financial snapshot:', error);
    return NextResponse.json({ error: 'Error fetching financial snapshot' }, { status: 500 });
  }
}