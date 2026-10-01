import React from 'react';

export type BadgeVariant = 'neutral' | 'blue' | 'green' | 'amber' | 'red' | 'purple';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-1.5 py-0.5 rounded',
    md: 'text-xs px-2 py-0.5 rounded-md',
  };

  const variantClasses: Record<BadgeVariant, string> = {
    neutral: 'bg-gray-100 text-gray-700 border border-gray-200/60',
    blue: 'bg-blue-50 text-blue-700 border border-blue-200/60',
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200/60',
    red: 'bg-red-50 text-red-700 border border-red-200/60',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200/60',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium select-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
