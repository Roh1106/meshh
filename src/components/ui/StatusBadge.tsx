import React from 'react';
import { SessionStatus } from '../../types';

export const StatusBadge: React.FC<{ status: SessionStatus | string }> = ({ status }) => {
  switch (status) {
    case 'Completed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          Completed
        </span>
      );
    case 'In progress':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          In Progress
        </span>
      );
    case 'Scheduled':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          Scheduled
        </span>
      );
    case 'Requested':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          Requested
        </span>
      );
    case 'Cancelled':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
          Cancelled
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          {status}
        </span>
      );
  }
};
