import React from 'react';

export interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  badge?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
  badge,
}) => {
  const [imgError, setImgError] = React.useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs sm:text-sm',
    lg: 'w-12 h-12 text-sm sm:text-base',
    xl: 'w-16 h-16 text-lg sm:text-xl',
  };

  const getInitials = (n: string) => {
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-block shrink-0 select-none ${className}`}>
      {src && !imgError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          className={`${sizeClasses[size]} rounded-full object-cover border border-gray-200 bg-gray-100`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-blue-100 text-blue-800 font-semibold flex items-center justify-center border border-blue-200/50`}
        >
          {getInitials(name)}
        </div>
      )}
      {badge && <div className="absolute -bottom-1 -right-1">{badge}</div>}
    </div>
  );
};
