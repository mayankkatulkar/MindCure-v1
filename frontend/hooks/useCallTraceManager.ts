import { useRef, useState } from 'react';
import { useRoomContext } from '@livekit/components-react';
import type { ReceivedChatMessage } from '@livekit/components-react';

export interface CallTraceData {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  messages: ReceivedChatMessage[];
  participantCount: number;
  duration?: number;
  messageCount: number;
  userMessageCount: number;
  agentMessageCount: number;
}

export function useCallTraceManager() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const sessionDataRef = useRef<CallTraceData | null>(null);
  const [messages, setMessages] = useState<ReceivedChatMessage[]>([]);

  // Get room context - this will throw if not in LiveKit context
  const room = useRoomContext();
  const isInRoomContext = room && room.state !== 'disconnected';

  // Safe room access
  const getParticipantCount = () => {
    try {
      return isInRoomContext ? room.numParticipants : 1;
    } catch (error) {
      console.warn('Could not access room participant count:', error);
      return 1;
    }
  };

  // Initialize session data when session starts
  const startSession = () => {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionDataRef.current = {
      sessionId,
      startTime: new Date(),
      messages: [],
      participantCount: getParticipantCount(),
      messageCount: 0,
      userMessageCount: 0,
      agentMessageCount: 0,
    };
    setIsSessionActive(true);
    console.log('Call trace session started:', sessionId);
  };

  // Add message to session data
  const addMessage = (message: ReceivedChatMessage) => {
    if (sessionDataRef.current) {
      sessionDataRef.current.messages.push(message);
      sessionDataRef.current.messageCount++;

      if (message.from?.isLocal) {
        sessionDataRef.current.userMessageCount++;
      } else {
        sessionDataRef.current.agentMessageCount++;
      }

      console.log('Message added to call trace:', {
        messageId: message.id,
        from: message.from?.identity,
        isLocal: message.from?.isLocal,
        totalMessages: sessionDataRef.current.messageCount,
      });
    }
    setMessages((prev) => [...prev, message]);
  };

  // End session and save call trace
  const endSession = async () => {
    if (!sessionDataRef.current) {
      console.log('No session data to save');
      return;
    }

    const sessionData = sessionDataRef.current;
    sessionData.endTime = new Date();
    sessionData.duration = sessionData.endTime.getTime() - sessionData.startTime.getTime();

    console.log('Saving call trace for session:', sessionData.sessionId, {
      messageCount: sessionData.messageCount,
      duration: sessionData.duration,
    });

    // Create call trace data
    const callTrace = {
      id: sessionData.sessionId,
      timestamp: sessionData.startTime.toISOString(),
      sessionId: sessionData.sessionId,
      messageType: 'session',
      message: `Session with ${sessionData.messageCount} messages`,
      responseTime: sessionData.duration,
      tokenCount: sessionData.messageCount * 10, // Estimate
      confidence: 0.95,
      status: 'success',
      metadata: {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 1000,
        userId: `user-${Date.now()}`,
        sessionDuration: Math.floor(sessionData.duration / 1000),
        participantCount: sessionData.participantCount,
        messageCount: sessionData.messageCount,
        userMessageCount: sessionData.userMessageCount,
        agentMessageCount: sessionData.agentMessageCount,
        messages: sessionData.messages.map((msg) => ({
          id: msg.id,
          timestamp: msg.timestamp,
          message: msg.message,
          from: msg.from?.identity || 'unknown',
          isLocal: msg.from?.isLocal || false,
        })),
      },
    };

    try {
      const response = await fetch('/api/add-call-trace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(callTrace),
      });

      if (!response.ok) {
        console.error('Failed to save call trace:', response.status, response.statusText);
      } else {
        console.log('Call trace saved successfully');
      }
    } catch (error) {
      console.error('Error saving call trace:', error);
    }

    // Reset session data
    sessionDataRef.current = null;
    setIsSessionActive(false);
    setMessages([]);
  };

  return {
    isSessionActive,
    messages,
    startSession,
    endSession,
    addMessage,
    isInRoomContext,
  };
}
