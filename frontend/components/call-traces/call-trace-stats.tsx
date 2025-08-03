'use client';

import React from 'react';
import { motion } from 'motion/react';
import type { CallTrace } from './call-traces-view';

interface CallTraceStatsProps {
  traces: CallTrace[];
}

export function CallTraceStats({ traces }: CallTraceStatsProps) {
  const stats = React.useMemo(() => {
    const totalTraces = traces.length;
    const successCount = traces.filter((t) => t.status === 'success').length;
    const errorCount = traces.filter((t) => t.status === 'error').length;
    const pendingCount = traces.filter((t) => t.status === 'pending').length;

    const avgResponseTime =
      traces.length > 0 ? traces.reduce((sum, t) => sum + t.responseTime, 0) / traces.length : 0;

    const avgConfidence =
      traces.length > 0 ? traces.reduce((sum, t) => sum + t.confidence, 0) / traces.length : 0;

    const totalTokens = traces.reduce((sum, t) => sum + t.tokenCount, 0);

    const userMessages = traces.filter((t) => t.messageType === 'user').length;
    const agentMessages = traces.filter((t) => t.messageType === 'agent').length;
    const systemMessages = traces.filter((t) => t.messageType === 'system').length;

    // New metrics from logs
    const tracesWithTTFT = traces.filter((t) => t.metadata.ttft);
    const avgTTFT =
      tracesWithTTFT.length > 0
        ? tracesWithTTFT.reduce((sum, t) => sum + (t.metadata.ttft || 0), 0) / tracesWithTTFT.length
        : 0;

    const tracesWithAudio = traces.filter((t) => t.metadata.audioDuration);
    const totalAudioDuration = tracesWithAudio.reduce(
      (sum, t) => sum + (t.metadata.audioDuration || 0),
      0
    );

    const toolUsage = traces.filter((t) => t.metadata.toolUsed).length;
    const languageBreakdown = traces.reduce(
      (acc, t) => {
        const lang = t.metadata.language || 'unknown';
        acc[lang] = (acc[lang] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const avgTokensPerSecond =
      traces.filter((t) => t.metadata.tokensPerSecond).length > 0
        ? traces
            .filter((t) => t.metadata.tokensPerSecond)
            .reduce((sum, t) => sum + (t.metadata.tokensPerSecond || 0), 0) /
          traces.filter((t) => t.metadata.tokensPerSecond).length
        : 0;

    return {
      totalTraces,
      successCount,
      errorCount,
      pendingCount,
      avgResponseTime: Math.round(avgResponseTime),
      avgConfidence: Math.round(avgConfidence * 100) / 100,
      totalTokens,
      userMessages,
      agentMessages,
      systemMessages,
      successRate: totalTraces > 0 ? (successCount / totalTraces) * 100 : 0,
      avgTTFT: Math.round(avgTTFT * 1000),
      totalAudioDuration: Math.round(totalAudioDuration),
      toolUsage,
      languageBreakdown,
      avgTokensPerSecond: Math.round(avgTokensPerSecond * 10) / 10,
    };
  }, [traces]);

  const statCards = [
    {
      title: 'Total Traces',
      value: stats.totalTraces,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate.toFixed(1)}%`,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Avg Response Time',
      value: `${stats.avgResponseTime}ms`,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Total Tokens',
      value: stats.totalTokens.toLocaleString(),
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      title: 'Avg TTFT',
      value: `${stats.avgTTFT}ms`,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
    {
      title: 'Tool Usage',
      value: stats.toolUsage,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      ),
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
    },
    {
      title: 'Avg Tokens/sec',
      value: stats.avgTokensPerSecond,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    },
  ];

  const statusCards = [
    {
      title: 'Success',
      count: stats.successCount,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    {
      title: 'Errors',
      count: stats.errorCount,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      borderColor: 'border-red-200 dark:border-red-800',
    },
    {
      title: 'Pending',
      count: stats.pendingCount,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
    },
  ];

  const messageTypeCards = [
    {
      title: 'User Messages',
      count: stats.userMessages,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      title: 'Agent Messages',
      count: stats.agentMessages,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      borderColor: 'border-purple-200 dark:border-purple-800',
    },
    {
      title: 'System Messages',
      count: stats.systemMessages,
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-900/30',
      borderColor: 'border-gray-200 dark:border-gray-800',
    },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800 ${stat.bgColor}`}
          >
            {/* Gradient overlay */}
            <div
              className={`absolute top-0 right-0 h-32 w-32 bg-gradient-to-br ${stat.color} translate-x-16 -translate-y-16 rounded-full opacity-10`}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {stat.title}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-xl bg-gradient-to-br p-3 ${stat.color} text-white`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Status and Message Type Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800"
        >
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            Status Breakdown
          </h3>
          <div className="space-y-3">
            {statusCards.map((status) => (
              <div
                key={status.title}
                className={`flex items-center justify-between rounded-lg border p-3 ${status.bgColor} ${status.borderColor}`}
              >
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {status.title}
                </span>
                <span className={`text-lg font-bold ${status.color}`}>{status.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Message Type Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800"
        >
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            Message Types
          </h3>
          <div className="space-y-3">
            {messageTypeCards.map((type) => (
              <div
                key={type.title}
                className={`flex items-center justify-between rounded-lg border p-3 ${type.bgColor} ${type.borderColor}`}
              >
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {type.title}
                </span>
                <span className={`text-lg font-bold ${type.color}`}>{type.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Average Confidence */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Average Confidence
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Overall confidence score across all traces
            </p>
          </div>
          <div className="text-right">
            <div
              className={`text-3xl font-bold ${stats.avgConfidence >= 0.9 ? 'text-green-600 dark:text-green-400' : stats.avgConfidence >= 0.7 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}
            >
              {(stats.avgConfidence * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {stats.avgConfidence >= 0.9
                ? 'Excellent'
                : stats.avgConfidence >= 0.7
                  ? 'Good'
                  : 'Needs Improvement'}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
