'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import type { CallTrace } from './call-traces-view';

interface CallTraceCardProps {
  trace: CallTrace;
}

export function CallTraceCard({ trace }: CallTraceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'user':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'agent':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'system':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 dark:text-green-400';
    if (confidence >= 0.7) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <motion.div
      initial={false}
      animate={{ height: isExpanded ? 'auto' : 'auto' }}
      className="p-6 transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
    >
      <div className="flex items-start justify-between">
        {/* Left side - Main content */}
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center space-x-3">
            {/* Message Type Badge */}
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getMessageTypeColor(trace.messageType)}`}
            >
              {trace.messageType.charAt(0).toUpperCase() + trace.messageType.slice(1)}
            </span>

            {/* Status Badge */}
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(trace.status)}`}
            >
              {trace.status.charAt(0).toUpperCase() + trace.status.slice(1)}
            </span>

            {/* Session ID */}
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
              {trace.sessionId}
            </span>
          </div>

          {/* Message */}
          <div className="mb-3">
            <p className="text-sm leading-relaxed text-slate-900 dark:text-white">
              {trace.message.length > 150 && !isExpanded
                ? `${trace.message.substring(0, 150)}...`
                : trace.message}
            </p>
            {trace.message.length > 150 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 gap-4 text-xs md:grid-cols-4">
            <div className="flex items-center space-x-2">
              <svg
                className="h-4 w-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-slate-600 dark:text-slate-400">Response:</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {trace.responseTime}ms
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <svg
                className="h-4 w-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              <span className="text-slate-600 dark:text-slate-400">Tokens:</span>
              <span className="font-medium text-slate-900 dark:text-white">{trace.tokenCount}</span>
            </div>

            <div className="flex items-center space-x-2">
              <svg
                className="h-4 w-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-slate-600 dark:text-slate-400">Confidence:</span>
              <span className={`font-medium ${getConfidenceColor(trace.confidence)}`}>
                {(trace.confidence * 100).toFixed(1)}%
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <svg
                className="h-4 w-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="text-slate-600 dark:text-slate-400">Model:</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {trace.metadata.model}
              </span>
            </div>
          </div>

          {/* Additional Metrics Row */}
          {(trace.metadata.language || trace.metadata.audioDuration || trace.metadata.ttft) && (
            <div className="mt-3 grid grid-cols-2 gap-4 text-xs md:grid-cols-4">
              {trace.metadata.language && (
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-4 w-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                  </svg>
                  <span className="text-slate-600 dark:text-slate-400">Language:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {trace.metadata.language.toUpperCase()}
                  </span>
                </div>
              )}

              {trace.metadata.audioDuration && (
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-4 w-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                  <span className="text-slate-600 dark:text-slate-400">Audio:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {trace.metadata.audioDuration}s
                  </span>
                </div>
              )}

              {trace.metadata.ttft && (
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-4 w-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span className="text-slate-600 dark:text-slate-400">TTFT:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {(trace.metadata.ttft * 1000).toFixed(0)}ms
                  </span>
                </div>
              )}

              {trace.metadata.toolUsed && (
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-4 w-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-slate-600 dark:text-slate-400">Tool:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {trace.metadata.toolUsed}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side - Timestamp */}
        <div className="ml-4 text-right">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            <div>{formatTime(trace.timestamp)}</div>
            <div>{formatDate(trace.timestamp)}</div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700"
        >
          <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium text-slate-900 dark:text-white">
                Model Configuration
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Temperature:</span>
                  <span className="text-slate-900 dark:text-white">
                    {trace.metadata.temperature}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Max Tokens:</span>
                  <span className="text-slate-900 dark:text-white">{trace.metadata.maxTokens}</span>
                </div>
                {trace.metadata.userId && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">User ID:</span>
                    <span className="font-mono text-slate-900 dark:text-white">
                      {trace.metadata.userId}
                    </span>
                  </div>
                )}
                {trace.metadata.sessionDuration && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Session Duration:</span>
                    <span className="text-slate-900 dark:text-white">
                      {trace.metadata.sessionDuration}s
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-medium text-slate-900 dark:text-white">
                Performance Metrics
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Response Time:</span>
                  <span
                    className={`font-medium ${trace.responseTime < 1000 ? 'text-green-600 dark:text-green-400' : trace.responseTime < 2000 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}
                  >
                    {trace.responseTime}ms
                  </span>
                </div>
                {trace.metadata.ttft && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Time to First Token:</span>
                    <span className="text-slate-900 dark:text-white">
                      {(trace.metadata.ttft * 1000).toFixed(0)}ms
                    </span>
                  </div>
                )}
                {trace.metadata.promptTokens && trace.metadata.completionTokens && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Token Usage:</span>
                    <span className="text-slate-900 dark:text-white">
                      {trace.metadata.promptTokens}p + {trace.metadata.completionTokens}c
                    </span>
                  </div>
                )}
                {trace.metadata.tokensPerSecond && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Tokens/Second:</span>
                    <span className="text-slate-900 dark:text-white">
                      {trace.metadata.tokensPerSecond.toFixed(1)}
                    </span>
                  </div>
                )}
                {trace.metadata.audioDuration && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Audio Duration:</span>
                    <span className="text-slate-900 dark:text-white">
                      {trace.metadata.audioDuration}s
                    </span>
                  </div>
                )}
                {trace.metadata.endOfUtteranceDelay && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">EOU Delay:</span>
                    <span className="text-slate-900 dark:text-white">
                      {(trace.metadata.endOfUtteranceDelay * 1000).toFixed(0)}ms
                    </span>
                  </div>
                )}
                {trace.metadata.transcriptionDelay && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Transcription Delay:</span>
                    <span className="text-slate-900 dark:text-white">
                      {(trace.metadata.transcriptionDelay * 1000).toFixed(0)}ms
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Token Efficiency:</span>
                  <span className="text-slate-900 dark:text-white">
                    {trace.tokenCount > 0
                      ? (trace.message.length / trace.tokenCount).toFixed(1)
                      : 0}{' '}
                    chars/token
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Message Length:</span>
                  <span className="text-slate-900 dark:text-white">
                    {trace.message.length} chars
                  </span>
                </div>
                {trace.metadata.errorMessage && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Error:</span>
                    <span className="text-red-600 dark:text-red-400">
                      {trace.metadata.errorMessage}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
