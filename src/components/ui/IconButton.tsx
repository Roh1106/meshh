import React, { ButtonHTMLAttributes } from 'react';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'outline' | 'filled';
  'aria-label': string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  size = 'md',
  variant = 'ghost',
  children,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 rounded-md text-xs',
    md: 'w-9 h-9 rounded-lg text-sm',
    lg: 'w-10 h-10 rounded-lg text-base',
  };

  const variantClasses = {
    ghost: 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200',
    outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100',
    filled: 'bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300',
  };

  return (
    <button
      className={`inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
