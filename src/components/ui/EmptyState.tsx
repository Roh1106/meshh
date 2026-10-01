import React from 'react';
import { LucideIcon, FolderSearch } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon | React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 bg-white rounded-xl border border-gray-200/80 my-4 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center mb-3">
        {icon ? (
          typeof icon === 'function' ? (
            React.createElement(icon, { className: 'w-6 h-6' })
          ) : (
            icon
          )
        ) : (
          <FolderSearch className="w-6 h-6" />
        )}
      </div>
      <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-500 max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button size="sm" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
