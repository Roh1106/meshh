import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  backTo?: string;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  action,
  backTo,
  className = '',
}) => {
  const navigate = useNavigate();

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-4 border-b border-gray-200/80 ${className}`}>
      <div className="flex items-start gap-2.5 min-w-0">
        {backTo && (
          <button
            type="button"
            onClick={() => (backTo === 'back' ? navigate(-1) : navigate(backTo))}
            aria-label="Go back"
            className="w-8 h-8 -ml-1 mt-0.5 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight truncate">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 leading-normal">
              {description}
            </p>
          )}
        </div>
      </div>
      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
};
