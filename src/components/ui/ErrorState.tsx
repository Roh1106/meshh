import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load data',
  message = 'We encountered an error loading this content. Your local cached copy is still intact.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 bg-red-50/40 rounded-xl border border-red-200 my-4 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-600 max-w-sm mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <Button size="sm" variant="outline" leftIcon={<RotateCcw className="w-3.5 h-3.5" />} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
