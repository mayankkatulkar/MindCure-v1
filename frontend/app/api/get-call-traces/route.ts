import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// File path for storing traces
const TRACES_FILE = path.join(process.cwd(), 'data', 'call-traces.json');

// Initialize with sample data only once
async function initializeTraces() {
  try {
    // Check if traces file exists
    await fs.access(TRACES_FILE);
    // File exists, no need to initialize
    return;
  } catch {
    // File doesn't exist, create with sample data based on real logs
    const sampleTraces = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        sessionId: 'session-001',
        messageType: 'user',
        message: 'latest news about papers or research publications',
        responseTime: 2600,
        tokenCount: 45,
        confidence: 0.95,
        status: 'success',
        metadata: {
          model: 'gpt-4o-mini',
          temperature: 0.7,
          maxTokens: 1000,
          userId: 'user-123',
          sessionDuration: 300,
          language: 'en',
          audioDuration: 5.0,
          ttft: 0.66,
          promptTokens: 371,
          completionTokens: 44,
          tokensPerSecond: 27.87,
        },
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
        sessionId: 'session-001',
        messageType: 'agent',
        message:
          'The latest news about papers or research publications includes works such as "Redpajama: An open source recipe to reproduce llama training dataset" by Together Computer, "Flashattention-2: Faster attention with better parallelism and work partitioning" by Tri Dao, "Longnet: Scaling transformers to 1,000,000,000 tokens" by Jiayu Ding et al., "Glm: General language model pretraining with autoregressive blank infilling" by Zhengxiao Du et al., and "REALM: retrieval-augmented language model pre-training" by Kelvin Guu et al.',
        responseTime: 1800,
        tokenCount: 234,
        confidence: 0.92,
        status: 'success',
        metadata: {
          model: 'gpt-4o-mini',
          temperature: 0.7,
          maxTokens: 1000,
          userId: 'user-123',
          sessionDuration: 300,
          language: 'en',
          audioDuration: 14.54,
          ttft: 0.299,
          promptTokens: 452,
          completionTokens: 38,
          tokensPerSecond: 24.44,
          toolUsed: 'LiveKit_RAG_tool',
        },
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
        sessionId: 'session-001',
        messageType: 'user',
        message: 'तो तू सा app है क्या? जो बोलते show.',
        responseTime: 2100,
        tokenCount: 89,
        confidence: 0.88,
        status: 'success',
        metadata: {
          model: 'gpt-4o-mini',
          temperature: 0.7,
          maxTokens: 1000,
          userId: 'user-456',
          sessionDuration: 180,
          language: 'hi',
          audioDuration: 5.0,
          ttft: 0.69,
          promptTokens: 378,
          completionTokens: 35,
          tokensPerSecond: 21.47,
          endOfUtteranceDelay: 0.42,
          transcriptionDelay: 0.37,
        },
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
        sessionId: 'session-001',
        messageType: 'agent',
        message:
          'हाँ, यह एक AI-powered voice assistant app है जो आपकी बातचीत को समझ सकता है और जवाब दे सकता है।',
        responseTime: 1500,
        tokenCount: 156,
        confidence: 0.94,
        status: 'success',
        metadata: {
          model: 'gpt-4o-mini',
          temperature: 0.7,
          maxTokens: 1000,
          userId: 'user-456',
          sessionDuration: 180,
          language: 'hi',
          audioDuration: 5.1,
          ttft: 0.81,
          promptTokens: 405,
          completionTokens: 21,
          tokensPerSecond: 25.83,
          endOfUtteranceDelay: 0.42,
          transcriptionDelay: 0.39,
        },
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
        sessionId: 'session-001',
        messageType: 'user',
        message:
          'Basically तो financial data क्यों है कहीं तू तला जी दिला ना ते सके सांगोशुक तू दो.',
        responseTime: 500,
        tokenCount: 12,
        confidence: 0.45,
        status: 'error',
        metadata: {
          model: 'gpt-4o-mini',
          temperature: 0.7,
          maxTokens: 1000,
          userId: 'user-789',
          sessionDuration: 60,
          language: 'hi',
          audioDuration: 5.1,
          ttft: 0.59,
          promptTokens: 452,
          completionTokens: 38,
          tokensPerSecond: 24.44,
          endOfUtteranceDelay: 0.42,
          transcriptionDelay: 0.39,
          toolUsed: 'LiveKit_RAG_tool',
          errorMessage: 'No financial data found in knowledge base',
        },
      },
      {
        id: '6',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        sessionId: 'session-001',
        messageType: 'agent',
        message:
          'There is no information provided in the context about financial data news or trends.',
        responseTime: 1200,
        tokenCount: 67,
        confidence: 0.75,
        status: 'success',
        metadata: {
          model: 'gpt-4o-mini',
          temperature: 0.7,
          maxTokens: 1000,
          userId: 'user-789',
          sessionDuration: 60,
          language: 'hi',
          audioDuration: 5.05,
          ttft: 0.59,
          promptTokens: 452,
          completionTokens: 38,
          tokensPerSecond: 24.44,
          toolUsed: 'LiveKit_RAG_tool',
        },
      },
    ];

    // Ensure data directory exists
    const dataDir = path.dirname(TRACES_FILE);
    await fs.mkdir(dataDir, { recursive: true });

    // Write sample data to file
    await fs.writeFile(TRACES_FILE, JSON.stringify(sampleTraces, null, 2));
  }
}

export async function GET() {
  try {
    // Initialize traces if not already done
    await initializeTraces();

    // Read traces from file
    const tracesData = await fs.readFile(TRACES_FILE, 'utf-8');
    const traces = JSON.parse(tracesData);

    return NextResponse.json({
      success: true,
      traces: traces,
    });
  } catch (error) {
    console.error('Error getting call traces:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get call traces',
      },
      { status: 500 }
    );
  }
}
