import { NextRequest, NextResponse } from 'next/server';
import { addTrace } from '../get-call-traces/route';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // If the body contains a complete trace (from session end), use it directly
    if (body.id && body.sessionId && body.metadata) {
      await addTrace(body);

      return NextResponse.json({
        success: true,
        message: 'Call trace added successfully',
        trace: body,
      });
    }

    // Handle legacy format for backward compatibility
    const { message, messageType = 'user', status = 'success' } = body;

    // Create new trace
    const newTrace = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      sessionId: `session-${Date.now()}`,
      messageType,
      message: message || 'Test message',
      responseTime: Math.floor(Math.random() * 2000) + 500,
      tokenCount: Math.floor(Math.random() * 100) + 10,
      confidence: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
      status,
      metadata: {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 1000,
        userId: `user-${Date.now()}`,
        sessionDuration: Math.floor(Math.random() * 300) + 60,
      },
    };

    // Add new trace to the beginning
    await addTrace(newTrace);

    return NextResponse.json({
      success: true,
      message: 'Call trace added successfully',
      trace: newTrace,
    });
  } catch (error) {
    console.error('Error adding call trace:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to add call trace',
      },
      { status: 500 }
    );
  }
}
