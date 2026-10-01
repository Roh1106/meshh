import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}) => {
  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'h-8 px-2.5 text-xs rounded-md gap-1.5',
    md: 'h-9 px-3.5 text-xs sm:text-sm rounded-lg gap-2',
    lg: 'h-11 px-5 text-sm sm:text-base rounded-lg gap-2.5',
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 shadow-xs border border-transparent font-medium',
    secondary:
      'bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 disabled:bg-gray-50 disabled:text-gray-400 font-medium',
    outline:
      'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 disabled:border-gray-200 disabled:text-gray-300 font-medium',
    ghost:
      'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200 disabled:text-gray-300 font-medium',
    danger:
      'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-red-300 shadow-xs font-medium',
    success:
      'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-emerald-300 shadow-xs font-medium',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium transition-all select-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
