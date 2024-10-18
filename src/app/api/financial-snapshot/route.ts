// File: src/app/api/financial-snapshot/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import FinancialSnapshot from '@/models/FinancialSnapshot';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const snapshotData = await req.json();
    const userId = req.headers.get('X-User-ID');

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

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

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const userId = req.headers.get('X-User-ID');

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

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