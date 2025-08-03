'use client';

import React from 'react';
import { motion } from 'motion/react';

interface Filters {
  messageType: string;
  status: string;
  dateRange: string;
}

interface CallTraceFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function CallTraceFilters({ filters, onFiltersChange }: CallTraceFiltersProps) {
  const handleFilterChange = (key: keyof Filters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const filterOptions = {
    messageType: [
      { value: 'all', label: 'All Types' },
      { value: 'user', label: 'User Messages' },
      { value: 'agent', label: 'Agent Messages' },
      { value: 'system', label: 'System Messages' },
    ],
    status: [
      { value: 'all', label: 'All Status' },
      { value: 'success', label: 'Success' },
      { value: 'error', label: 'Error' },
      { value: 'pending', label: 'Pending' },
    ],
    dateRange: [
      { value: 'all', label: 'All Time' },
      { value: '1h', label: 'Last Hour' },
      { value: '24h', label: 'Last 24 Hours' },
      { value: '7d', label: 'Last 7 Days' },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Filters</h3>
        <button
          onClick={() => onFiltersChange({ messageType: 'all', status: 'all', dateRange: 'all' })}
          className="text-sm text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Message Type Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Message Type
          </label>
          <select
            value={filters.messageType}
            onChange={(e) => handleFilterChange('messageType', e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
          >
            {filterOptions.messageType.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
          >
            {filterOptions.status.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
          >
            {filterOptions.dateRange.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.messageType !== 'all' && (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Type:{' '}
            {filterOptions.messageType.find((opt) => opt.value === filters.messageType)?.label}
            <button
              onClick={() => handleFilterChange('messageType', 'all')}
              className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            >
              ×
            </button>
          </span>
        )}

        {filters.status !== 'all' && (
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
            Status: {filterOptions.status.find((opt) => opt.value === filters.status)?.label}
            <button
              onClick={() => handleFilterChange('status', 'all')}
              className="ml-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
            >
              ×
            </button>
          </span>
        )}

        {filters.dateRange !== 'all' && (
          <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            Time: {filterOptions.dateRange.find((opt) => opt.value === filters.dateRange)?.label}
            <button
              onClick={() => handleFilterChange('dateRange', 'all')}
              className="ml-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200"
            >
              ×
            </button>
          </span>
        )}
      </div>
    </motion.div>
  );
}
