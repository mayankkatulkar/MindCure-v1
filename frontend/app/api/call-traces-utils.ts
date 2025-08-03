import { promises as fs } from 'fs';
import path from 'path';

// File path for storing traces
const TRACES_FILE = path.join(process.cwd(), 'data', 'call-traces.json');

// Helper function to get traces (for other API endpoints)
export async function getTraces() {
  try {
    const tracesData = await fs.readFile(TRACES_FILE, 'utf-8');
    return JSON.parse(tracesData);
  } catch {
    return [];
  }
}

// Helper function to add traces (for other API endpoints)
export async function addTrace(trace: {
  id: string;
  timestamp: string;
  sessionId: string;
  messageType: 'user' | 'agent';
  message: string;
  responseTime: number;
  tokenCount: number;
  confidence: number;
  status: 'success' | 'error';
  metadata: Record<string, string | number | boolean>;
}) {
  try {
    const traces = await getTraces();
    traces.unshift(trace);
    await fs.writeFile(TRACES_FILE, JSON.stringify(traces, null, 2));
  } catch (error) {
    console.error('Error adding trace:', error);
  }
}

// Helper function to clear traces (for other API endpoints)
export async function clearTraces() {
  try {
    await fs.writeFile(TRACES_FILE, JSON.stringify([], null, 2));
  } catch (error) {
    console.error('Error clearing traces:', error);
  }
}
