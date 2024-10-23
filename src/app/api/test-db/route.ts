
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function GET() {
  try {
    console.log('Testing database connection...');
    const startTime = Date.now();
    
    await connectToDatabase();
    
    const connectionTime = Date.now() - startTime;
    console.log(`Database connected successfully in ${connectionTime}ms`);
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Database connected successfully',
      connectionTime: `${connectionTime}ms`
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: (error as Error).message 
    }, { status: 500 });
  }
}