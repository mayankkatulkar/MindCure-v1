import { NextResponse } from 'next/server';
import { clearTraces } from '../get-call-traces/route';

export async function POST() {
  try {
    // Clear the traces from file
    await clearTraces();

    console.log('Clearing all call traces...');

    // Simulate some processing time
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: 'All call traces have been cleared successfully',
    });
  } catch (error) {
    console.error('Error clearing call traces:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to clear call traces',
      },
      { status: 500 }
    );
  }
}
