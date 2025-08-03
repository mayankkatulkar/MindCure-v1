'use client';

import React, { useState } from 'react';
import { toastAlert } from '@/components/alert-toast';
import { CallTrace } from '@/components/call-traces/call-traces-view';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestCallTracesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    trace?: CallTrace;
    traces?: CallTrace[];
  } | null>(null);
  const [customPrompt, setCustomPrompt] = useState('Hello, how are you?');
  const [sessionDuration, setSessionDuration] = useState(30);
  const [messageCount, setMessageCount] = useState(5);
  const [model, setModel] = useState('gpt-4');

  const testCallTrace = async () => {
    setIsLoading(true);
    setResult(null);

    const testTrace = {
      id: `test-${Date.now()}`,
      timestamp: new Date().toISOString(),
      sessionId: `test-session-${Date.now()}`,
      messageType: 'session',
      message: `Test session with ${messageCount} messages`,
      responseTime: sessionDuration * 1000,
      tokenCount: messageCount * 10,
      confidence: 0.95,
      status: 'success',
      metadata: {
        model,
        temperature: 0.7,
        maxTokens: 1000,
        userId: `user-${Date.now()}`,
        sessionDuration,
        participantCount: 2,
        messageCount,
        userMessageCount: Math.ceil(messageCount / 2),
        agentMessageCount: Math.floor(messageCount / 2),
        messages: [
          {
            id: 'msg1',
            timestamp: Date.now() - sessionDuration * 1000 * 0.8,
            message: customPrompt,
            from: 'user-123',
            isLocal: true,
          },
          {
            id: 'msg2',
            timestamp: Date.now() - sessionDuration * 1000 * 0.6,
            message: `Response to: "${customPrompt}" - I am doing well, thank you for asking!`,
            from: 'agent-456',
            isLocal: false,
          },
          {
            id: 'msg3',
            timestamp: Date.now() - sessionDuration * 1000 * 0.4,
            message: 'Can you help me with something?',
            from: 'user-123',
            isLocal: true,
          },
          {
            id: 'msg4',
            timestamp: Date.now() - sessionDuration * 1000 * 0.2,
            message: 'Of course! I would be happy to help you with anything you need.',
            from: 'agent-456',
            isLocal: false,
          },
        ],
      },
    };

    try {
      const response = await fetch('/api/add-call-trace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testTrace),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toastAlert({
          title: 'Success',
          description: 'Test call trace saved successfully!',
        });
      } else {
        toastAlert({
          title: 'Error',
          description: data.message || 'Failed to save test call trace',
        });
      }
    } catch (error) {
      console.error('Error testing call trace:', error);
      toastAlert({
        title: 'Error',
        description: 'Failed to test call trace. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCallTraces = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/get-call-traces');
      const data = await response.json();
      setResult(data);

      if (data.success) {
        toastAlert({
          title: 'Success',
          description: `Retrieved ${data.traces?.length || 0} call traces`,
        });
      } else {
        toastAlert({
          title: 'Error',
          description: data.message || 'Failed to get call traces',
        });
      }
    } catch (error) {
      console.error('Error getting call traces:', error);
      toastAlert({
        title: 'Error',
        description: 'Failed to get call traces. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl pt-25">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Call Trace Testing</h1>
        <p className="text-muted-foreground">
          Test the call trace API endpoints to verify functionality
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Test Call Trace Saving</CardTitle>
            <CardDescription>Create a test call trace with custom parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Custom Prompt</label>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your test prompt..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Session Duration (sec)</label>
                <input
                  type="number"
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  min="1"
                  max="300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message Count</label>
                <input
                  type="number"
                  value={messageCount}
                  onChange={(e) => setMessageCount(Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  min="1"
                  max="20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="claude-3">Claude-3</option>
                  <option value="llama-2">Llama-2</option>
                </select>
              </div>
            </div>

            <Button onClick={testCallTrace} disabled={isLoading} className="w-full">
              {isLoading ? 'Testing...' : 'Test Call Trace Saving'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Get All Call Traces</CardTitle>
            <CardDescription>
              Retrieve all saved call traces to verify they are being stored
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={getCallTraces}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading ? 'Loading...' : 'Get Call Traces'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {result && (
        <div className="mt-6 space-y-6">
          {/* Success/Error Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success ? (
                  <>
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    API Call Successful
                  </>
                ) : (
                  <>
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    API Call Failed
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {result.success
                  ? `Successfully ${result.trace ? 'saved' : 'retrieved'} call trace data`
                  : result.message || 'An error occurred'}
              </CardDescription>
            </CardHeader>
          </Card>
          {/* Trace Details (if it's a single trace) */}
          {result.trace && (
            <Card>
              <CardHeader>
                <CardTitle>Trace Details</CardTitle>
                <CardDescription>Details of the saved call trace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Session ID</label>
                    <p className="text-sm">{result.trace.sessionId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Message Type</label>
                    <p className="text-sm">{result.trace.messageType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Response Time</label>
                    <p className="text-sm">{result.trace.responseTime}ms</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Token Count</label>
                    <p className="text-sm">{result.trace.tokenCount}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Message</label>
                  <p className="rounded bg-gray-50 p-2 text-sm">{result.trace.message}</p>
                </div>

                {result.trace.metadata && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Metadata</label>
                    <div className="rounded bg-gray-50 p-3 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="font-medium">Model:</span> {result.trace.metadata.model}
                        </div>
                        <div>
                          <span className="font-medium">Session Duration:</span>{' '}
                          {result.trace.metadata.sessionDuration}s
                        </div>
                        <div>
                          <span className="font-medium">Message Count:</span>{' '}
                          {result.trace.metadata.messageCount}
                        </div>
                        <div>
                          <span className="font-medium">User Messages:</span>{' '}
                          {result.trace.metadata.userMessageCount}
                        </div>
                        <div>
                          <span className="font-medium">Agent Messages:</span>{' '}
                          {result.trace.metadata.agentMessageCount}
                        </div>
                        <div>
                          <span className="font-medium">Participant Count:</span>{' '}
                          {result.trace.metadata.participantCount}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Raw JSON Response */}
          <Card>
            <CardHeader>
              <CardTitle>Raw API Response</CardTitle>
              <CardDescription>Complete JSON response from the API endpoint</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted max-h-96 overflow-auto rounded-md p-4 text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
