import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ToastMessage, ToastType } from '../types';
import { ToastContainer } from '../components/common/Toast';

interface ToastContextValue {
  showToast: (options: { message: string; title?: string; type?: ToastType; duration?: number }) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      message,
      title,
      type = 'info',
      duration = 4000,
    }: {
      message: string;
      title?: string;
      type?: ToastType;
      duration?: number;
    }) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newToast: ToastMessage = { id, message, title, type, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }
    },
    [dismissToast]
  );

  const showSuccess = useCallback((message: string, title?: string) => {
    showToast({ message, title, type: 'success' });
  }, [showToast]);

  const showError = useCallback((message: string, title?: string) => {
    showToast({ message, title, type: 'error' });
  }, [showToast]);

  const showWarning = useCallback((message: string, title?: string) => {
    showToast({ message, title, type: 'warning' });
  }, [showToast]);

  const showInfo = useCallback((message: string, title?: string) => {
    showToast({ message, title, type: 'info' });
  }, [showToast]);

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        dismissToast,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
