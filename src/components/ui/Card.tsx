import React, { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200/80 p-4 shadow-xs ${
        hoverable ? 'hover:border-gray-300 hover:shadow-sm transition-all' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
