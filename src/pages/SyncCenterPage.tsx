import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { useOffline } from '../context/OfflineContext';
import { useToast } from '../context/ToastContext';
import {
  RefreshCw,
  Radio,
  Wifi,
  WifiOff,
  CheckCircle2,
  Clock,
  HardDrive,
  ShieldCheck,
  FileText,
  BookOpen,
  Users,
  Shield,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';
import { resourceService } from '../services/resourceService';
import { syncManager, SyncStatus, SYNC_PROTOCOL_VERSION } from '../services/syncManager';
import { AcademicResource, DeviceTrustLevel, PeerDevice } from '../types';
import { PdfViewerModal, PdfDocument } from '../components/common/PdfViewerModal';

export const SyncCenterPage: React.FC = () => {
  const {
    effectiveOffline,
    toggleSimulatedOffline,
    discoverablePeersCount,
    lastSyncedText,
    isSyncing,
    triggerManualSync,
    pendingSyncCount,
  } = useOffline();
  const { showSuccess, showInfo } = useToast();
  const [downloadedBooks, setDownloadedBooks] = useState<AcademicResource[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<PdfDocument | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(syncManager.getStatus());

  useEffect(() => {
    syncManager.init();
    const unsubscribe = syncManager.subscribe((st) => setSyncStatus(st));

    resourceService.getResources({ offlineOnly: true }).then((list) => {
      setDownloadedBooks(list);
    });

    return () => unsubscribe();
  }, []);

  const handleManualSync = async () => {
    await syncManager.triggerSync();
    await triggerManualSync();
    showSuccess(`Campus Mesh synchronized. Protocol v${SYNC_PROTOCOL_VERSION} verified with LAN nodes.`, 'Sync Complete');
  };

  const handleTrustChange = (deviceId: string, newTrust: DeviceTrustLevel) => {
    syncManager.updatePeerTrust(deviceId, newTrust);
    showInfo(`Updated peer device trust to "${newTrust}".`);
  };

  return (
    <div className="space-y-6 pb-12 max-w-2xl mx-auto">
      <PageHeader
        title="Sync Center & Local Mesh"
        description="Monitor ad-hoc peer discovery, offline data reconciliation, and campus beacon status."
      />

      {/* Main Status Panel */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                effectiveOffline ? 'bg-gray-100 text-gray-500' : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {effectiveOffline ? 'Offline Node' : 'Campus Mesh Active'}
              </p>
              <p className="text-xs text-gray-500">{lastSyncedText}</p>
            </div>
          </div>

          <button
            onClick={handleManualSync}
            disabled={isSyncing || effectiveOffline}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>

        {/* Sync Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-gray-400 block text-[11px]">Discoverable Peers</span>
            <span className="text-base font-bold text-gray-900">
              {effectiveOffline ? 0 : discoverablePeersCount} students
            </span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-gray-400 block text-[11px]">Pending Sync Queue</span>
            <span className="text-base font-bold text-blue-600">
              {pendingSyncCount} operations
            </span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 col-span-2 sm:col-span-1">
            <span className="text-gray-400 block text-[11px]">Sync Conflicts</span>
            <span className="text-base font-bold text-emerald-700">0 (Clean)</span>
          </div>
        </div>
      </div>

      {/* Local Mesh Topology Explanation */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-xs space-y-3 text-xs sm:text-sm">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Offline-First Peer Protocol</span>
        </h3>
        <p className="text-gray-600 leading-relaxed text-xs">
          SkillMesh operates with an optimistic offline model: doubts, session bookings, and test
          attempts are stored directly on your phone or laptop. When in proximity to other campus
          devices or when Wi-Fi is reachable, the mesh reconciles updates using cryptographically
          stamped event logs.
        </p>

        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">Simulate Offline Mode:</span>
          <button
            onClick={toggleSimulatedOffline}
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {effectiveOffline ? 'Reconnect Campus Mesh' : 'Go Offline'}
          </button>
        </div>
      </div>

      {/* LAN Peer Devices & Trust Management */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Users className="w-4.5 h-4.5 text-blue-600" />
            <h3 className="font-semibold text-gray-900 text-sm">
              Discovered Mesh Nodes & Device Trust ({syncStatus.discoverablePeers.length})
            </h3>
          </div>
          <span className="text-[11px] font-mono text-gray-500">
            Protocol v{SYNC_PROTOCOL_VERSION}
          </span>
        </div>
        <p className="text-xs text-gray-500">
          Unknown devices on the same Wi-Fi or Bluetooth mesh must be paired before automatic note synchronization.
        </p>

        <div className="space-y-2 pt-1">
          {syncStatus.discoverablePeers.map((peer) => (
            <div
              key={peer.deviceId}
              className="p-3 bg-gray-50/70 rounded-lg border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{peer.studentName}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-mono font-semibold text-[10px] ${
                        peer.trustLevel === 'trusted'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : peer.trustLevel === 'paired'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : peer.trustLevel === 'blocked'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}
                    >
                      {peer.trustLevel.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {peer.department} · {peer.lastSeen} · Device: {peer.deviceId}
                  </p>
                </div>
              </div>

              {/* Trust Controls */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                {peer.trustLevel !== 'trusted' && (
                  <button
                    type="button"
                    onClick={() => handleTrustChange(peer.deviceId, 'trusted')}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded text-xs font-medium transition-colors"
                  >
                    Trust
                  </button>
                )}
                {peer.trustLevel !== 'paired' && peer.trustLevel !== 'trusted' && (
                  <button
                    type="button"
                    onClick={() => handleTrustChange(peer.deviceId, 'paired')}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-2xs transition-colors"
                  >
                    Pair
                  </button>
                )}
                {peer.trustLevel !== 'blocked' ? (
                  <button
                    type="button"
                    onClick={() => handleTrustChange(peer.deviceId, 'blocked')}
                    className="px-2 py-1 bg-white hover:bg-red-50 text-red-600 border border-gray-300 rounded text-xs transition-colors"
                    title="Block node"
                  >
                    Block
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleTrustChange(peer.deviceId, 'discovered')}
                    className="px-2 py-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded text-xs transition-colors"
                  >
                    Unblock
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Offline Downloaded Books & Documents */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4.5 h-4.5 text-blue-600" />
            <h3 className="font-semibold text-gray-900 text-sm">
              Downloaded Books & Offline Documents ({downloadedBooks.length})
            </h3>
          </div>
          <span className="text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/70">
            Stored Locally
          </span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          These academic PDF textbooks and formula sheets are cached locally and open instantly even without network connection.
        </p>

        <div className="space-y-2 pt-1">
          {downloadedBooks.map((book) => (
            <div
              key={book.id}
              className="p-3 bg-gray-50/70 rounded-lg border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{book.title}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {book.subject} · {book.format} ({book.fileSize}) · {book.semester}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedPdf({
                    id: book.id,
                    title: book.title,
                    subject: book.subject,
                    department: book.department,
                    fileSize: book.fileSize,
                    authorOrSource: `${book.author} (${book.authorRole || 'Faculty / Senior'})`,
                  })
                }
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors shrink-0 self-start sm:self-auto"
                title="Open and read document in Academic PDF Reader"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Open PDF</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* PDF Reader Modal */}
      <PdfViewerModal
        document={selectedPdf}
        isOpen={!!selectedPdf}
        onClose={() => setSelectedPdf(null)}
      />
    </div>
  );
};
