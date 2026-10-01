import React from 'react';

export const AvatarGroup: React.FC<{
  initials: string[];
  max?: number;
  size?: 'sm' | 'md';
}> = ({ initials, max = 3, size = 'sm' }) => {
  const displayed = initials.slice(0, max);
  const remainder = initials.length - max;

  const sizeClasses = size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-7 h-7 text-xs';

  const colors = [
    'bg-blue-100 text-blue-800 ring-2 ring-white',
    'bg-emerald-100 text-emerald-800 ring-2 ring-white',
    'bg-amber-100 text-amber-800 ring-2 ring-white',
    'bg-purple-100 text-purple-800 ring-2 ring-white',
  ];

  return (
    <div className="flex -space-x-1.5 overflow-hidden items-center">
      {displayed.map((ini, idx) => (
        <div
          key={idx}
          className={`inline-flex rounded-full font-bold items-center justify-center shrink-0 ${sizeClasses} ${
            colors[idx % colors.length]
          }`}
        >
          {ini}
        </div>
      ))}
      {remainder > 0 && (
        <div
          className={`inline-flex rounded-full font-bold items-center justify-center shrink-0 bg-gray-200 text-gray-700 ring-2 ring-white ${sizeClasses}`}
        >
          +{remainder}
        </div>
      )}
    </div>
  );
};
