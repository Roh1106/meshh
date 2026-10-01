import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useOffline } from '../../context/OfflineContext';

export const CampusMeshBanner: React.FC = () => {
  const {
    effectiveOffline,
    discoverablePeersCount,
    toggleSimulatedOffline,
    triggerManualSync,
    isSyncing,
  } = useOffline();

  return (
    <div className="w-full">
      <div
        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors border ${
          effectiveOffline
            ? 'bg-gray-100 text-gray-700 border-gray-200'
            : 'bg-emerald-50/80 text-emerald-900 border-emerald-200/60'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              effectiveOffline ? 'bg-gray-400' : 'bg-emerald-600 animate-pulse'
            }`}
          />
          <span className="font-medium truncate">
            {effectiveOffline
              ? 'Offline Mode Active — Using local device storage & cached courseware'
              : `Campus Mesh Active · ${discoverablePeersCount} Peers Discoverable Nearby`}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          {!effectiveOffline && (
            <button
              onClick={triggerManualSync}
              disabled={isSyncing}
              aria-label="Sync mesh data"
              className="text-gray-500 hover:text-blue-600 transition-colors p-0.5 rounded"
              title="Sync mesh data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          )}
          <button
            onClick={toggleSimulatedOffline}
            className={`font-semibold hover:underline cursor-pointer ${
              effectiveOffline ? 'text-blue-600' : 'text-blue-600'
            }`}
          >
            {effectiveOffline ? 'Reconnect Mesh' : 'Offline Mode'}
          </button>
        </div>
      </div>
    </div>
  );
};
