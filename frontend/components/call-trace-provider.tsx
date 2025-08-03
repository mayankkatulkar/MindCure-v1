'use client';

import React, { ReactNode, createContext, useContext } from 'react';
import { useRoomContext } from '@livekit/components-react';
import { useCallTraceManager } from '@/hooks/useCallTraceManager';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */

export interface CallTraceContextType {
  isSessionActive: boolean;
  messages: any[];
  startSession: () => void;
  endSession: () => Promise<void>;
  addMessage: (message: any) => void;
  isInRoomContext: boolean;
}

const CallTraceContext = createContext<CallTraceContextType | null>(null);

export function useCallTraceContext() {
  const context = useContext(CallTraceContext);
  if (!context) {
    // Return a default implementation when not in LiveKit context
    return {
      isSessionActive: false,
      messages: [],
      startSession: () => console.log('Call trace not available outside LiveKit context'),
      endSession: async () => console.log('Call trace not available outside LiveKit context'),
      addMessage: () => console.log('Call trace not available outside LiveKit context'),
      isInRoomContext: false,
    };
  }
  return context;
}

interface CallTraceProviderProps {
  children: ReactNode;
}

export function CallTraceProvider({ children }: CallTraceProviderProps) {
  // Only use the hook if we're in a LiveKit context
  let callTraceManager;

  try {
    const room = useRoomContext();
    if (room && room.state !== 'disconnected') {
      callTraceManager = useCallTraceManager();
    }
  } catch (error) {
    console.warn('Not in LiveKit context, call traces disabled, error:', error);
  }

  const value = callTraceManager || {
    isSessionActive: false,
    messages: [],
    startSession: () => console.log('Call trace not available outside LiveKit context'),
    endSession: async () => console.log('Call trace not available outside LiveKit context'),
    addMessage: () => console.log('Call trace not available outside LiveKit context'),
    isInRoomContext: false,
  };

  return <CallTraceContext.Provider value={value}>{children}</CallTraceContext.Provider>;
}
