'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { CallTraceCard } from './call-trace-card';
import { CallTraceFilters } from './call-trace-filters';
import { CallTraceStats } from './call-trace-stats';

export interface CallTrace {
  id: string;
  timestamp: Date;
  sessionId: string;
  messageType: 'user' | 'agent' | 'system' | 'session';
  message: string;
  responseTime: number;
  tokenCount: number;
  confidence: number;
  status: 'success' | 'error' | 'pending';
  metadata: {
    model: string;
    temperature: number;
    maxTokens: number;
    userId?: string;
    sessionDuration?: number;
    language?: string;
    audioDuration?: number;
    ttft?: number;
    promptTokens?: number;
    completionTokens?: number;
    tokensPerSecond?: number;
    endOfUtteranceDelay?: number;
    transcriptionDelay?: number;
    toolUsed?: string;
    errorMessage?: string;
    // Additional fields from test page
    participantCount?: number;
    messageCount?: number;
    userMessageCount?: number;
    agentMessageCount?: number;
    messages?: Array<{
      id: string;
      timestamp: number;
      message: string;
      from: string;
      isLocal: boolean;
    }>;
  };
}

export function CallTracesView() {
  const [traces, setTraces] = useState<CallTrace[]>([]);
  const [filteredTraces, setFilteredTraces] = useState<CallTrace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    messageType: 'all',
    status: 'all',
    dateRange: 'all',
  });

  // Load traces from API
  useEffect(() => {
    const loadTraces = async () => {
      try {
        const response = await fetch('/api/get-call-traces');
        const data = await response.json();

        if (data.success) {
          const parsedTraces = data.traces.map((trace: CallTrace) => ({
            ...trace,
            timestamp: new Date(trace.timestamp),
          }));
          setTraces(parsedTraces);
          setFilteredTraces(parsedTraces);
        } else {
          console.error('Failed to load traces:', data.message);
          setTraces([]);
          setFilteredTraces([]);
        }
      } catch (error) {
        console.error('Error loading traces:', error);
        setTraces([]);
        setFilteredTraces([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate loading delay
    setTimeout(loadTraces, 1000);
  }, []);

  // Listen for clear call traces events
  useEffect(() => {
    const handleClearTraces = () => {
      setTraces([]);
      setFilteredTraces([]);
    };

    // Listen for custom event when traces are cleared
    window.addEventListener('clear-call-traces', handleClearTraces);

    return () => {
      window.removeEventListener('clear-call-traces', handleClearTraces);
    };
  }, []);

  // Filter traces based on current filters
  useEffect(() => {
    let filtered = traces;

    if (filters.messageType !== 'all') {
      filtered = filtered.filter((trace) => trace.messageType === filters.messageType);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter((trace) => trace.status === filters.status);
    }

    if (filters.dateRange !== 'all') {
      const now = new Date();
      const timeRanges = {
        '1h': now.getTime() - 60 * 60 * 1000,
        '24h': now.getTime() - 24 * 60 * 60 * 1000,
        '7d': now.getTime() - 7 * 24 * 60 * 60 * 1000,
      };

      if (filters.dateRange in timeRanges) {
        filtered = filtered.filter(
          (trace) =>
            trace.timestamp.getTime() > timeRanges[filters.dateRange as keyof typeof timeRanges]
        );
      }
    }

    setFilteredTraces(filtered);
  }, [traces, filters]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading call traces...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-slate-900 dark:text-white">
                Call Traces
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Monitor and analyze conversation metrics and performance
              </p>
            </div>
            <Link
              href="/test-call-traces"
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              Test API
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <CallTraceStats traces={filteredTraces} />

        {/* Filters */}
        <CallTraceFilters filters={filters} onFiltersChange={setFilters} />

        {/* Traces List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Recent Traces ({filteredTraces.length})
              </h2>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              <AnimatePresence>
                {filteredTraces.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-6 py-12 text-center"
                  >
                    <div className="text-slate-400 dark:text-slate-500">
                      <svg
                        className="mx-auto mb-4 h-12 w-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-lg font-medium">No traces found</p>
                      <p className="text-sm">Try adjusting your filters to see more results</p>
                    </div>
                  </motion.div>
                ) : (
                  filteredTraces.map((trace, index) => (
                    <motion.div
                      key={trace.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <CallTraceCard trace={trace} />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
