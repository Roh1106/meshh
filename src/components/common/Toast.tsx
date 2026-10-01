import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { ToastMessage, ToastType } from '../../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />,
  error: <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />,
  info: <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />,
};

const borderMap: Record<ToastType, string> = {
  success: 'border-l-4 border-l-green-600 bg-white border border-gray-200',
  error: 'border-l-4 border-l-red-600 bg-white border border-gray-200',
  warning: 'border-l-4 border-l-amber-600 bg-white border border-gray-200',
  info: 'border-l-4 border-l-blue-600 bg-white border border-gray-200',
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  return (
    <div
      role="status"
      className={`pointer-events-auto rounded-lg p-3.5 shadow-md flex items-start justify-between gap-3 text-sm text-gray-800 transition-all duration-200 ${borderMap[toast.type]}`}
    >
      <div className="flex items-start gap-2.5 min-w-0">
        {iconMap[toast.type]}
        <div className="flex flex-col">
          {toast.title && <span className="font-semibold text-gray-900 leading-tight mb-0.5">{toast.title}</span>}
          <span className="text-gray-700 leading-normal">{toast.message}</span>
        </div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="text-gray-400 hover:text-gray-600 p-1 -mr-1 -mt-1 rounded hover:bg-gray-100 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
