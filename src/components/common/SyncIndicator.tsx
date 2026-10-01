import React from 'react';
import { RefreshCw, CheckCircle2, CloudOff } from 'lucide-react';
import { useOffline } from '../../context/OfflineContext';

export const SyncIndicator: React.FC<{ showLabel?: boolean }> = ({ showLabel = true }) => {
  const { effectiveOffline, lastSyncedText, isSyncing, triggerManualSync } = useOffline();

  if (effectiveOffline) {
    return (
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs border border-gray-200"
        title="Offline mode active"
      >
        <CloudOff className="w-3.5 h-3.5 text-gray-500" />
        {showLabel && <span className="font-medium">Offline</span>}
      </div>
    );
  }

  return (
    <button
      onClick={triggerManualSync}
      disabled={isSyncing}
      title="Click to trigger campus sync"
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs border border-emerald-200/60 hover:bg-emerald-100 transition-colors"
    >
      {isSyncing ? (
        <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
      ) : (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
      )}
      {showLabel && (
        <span className="font-medium text-emerald-700">
          {isSyncing ? 'Syncing...' : lastSyncedText}
        </span>
      )}
    </button>
  );
};
