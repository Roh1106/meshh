import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface OfflineContextValue {
  isOnline: boolean;
  isMeshActive: boolean;
  isSimulatedOffline: boolean;
  effectiveOffline: boolean;
  discoverablePeersCount: number;
  lastSyncedText: string;
  isSyncing: boolean;
  pendingSyncCount: number;
  toggleSimulatedOffline: () => void;
  triggerManualSync: () => Promise<void>;
  incrementPendingSync: () => void;
}

const OfflineContext = createContext<OfflineContextValue | null>(null);

export const OfflineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [realOnline, setRealOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [isMeshActive, setIsMeshActive] = useState<boolean>(true);
  const [discoverablePeersCount, setDiscoverablePeersCount] = useState<number>(14);
  const [lastSyncedText, setLastSyncedText] = useState<string>('Synced 2m ago');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  useEffect(() => {
    const handleOnline = () => setRealOnline(true);
    const handleOffline = () => setRealOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const effectiveOffline = !realOnline || isSimulatedOffline;

  const toggleSimulatedOffline = useCallback(() => {
    setIsSimulatedOffline((prev) => {
      const next = !prev;
      if (next) {
        setIsMeshActive(false);
      } else {
        setIsMeshActive(true);
      }
      return next;
    });
  }, []);

  const triggerManualSync = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setLastSyncedText('Syncing mesh data...');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setLastSyncedText('Synced just now');
      setPendingSyncCount(0);
      setDiscoverablePeersCount((prev) => Math.max(12, Math.min(18, prev + Math.floor(Math.random() * 3) - 1)));
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing]);

  const incrementPendingSync = useCallback(() => {
    setPendingSyncCount((prev) => prev + 1);
  }, []);

  return (
    <OfflineContext.Provider
      value={{
        isOnline: realOnline,
        isMeshActive,
        isSimulatedOffline,
        effectiveOffline,
        discoverablePeersCount,
        lastSyncedText,
        isSyncing,
        pendingSyncCount,
        toggleSimulatedOffline,
        triggerManualSync,
        incrementPendingSync,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export function useOffline(): OfflineContextValue {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
}
