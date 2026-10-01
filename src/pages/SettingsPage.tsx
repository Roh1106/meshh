import React, { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { DEFAULT_CAMPUS, APP_VERSION } from '../constants/app';
import { useOffline } from '../context/OfflineContext';
import { useToast } from '../context/ToastContext';
import { HardDrive, Bell, Shield, Wifi, RefreshCw } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { effectiveOffline, toggleSimulatedOffline } = useOffline();
  const { showSuccess } = useToast();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offlinePreloadNotes, setOfflinePreloadNotes] = useState(true);
  const [selectedCampus, setSelectedCampus] = useState(DEFAULT_CAMPUS.name);

  const handleClearCache = () => {
    showSuccess('Temporary courseware cache cleared. Core saved documents remain safe.');
  };

  return (
    <div className="space-y-6 pb-12 max-w-2xl mx-auto">
      <PageHeader
        title="Settings & Preferences"
        description="Local storage quotas, campus network configuration, and offline sync preferences."
      />

      {/* Campus Node Setup */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-xs space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <span>Campus & Institution</span>
        </h3>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Assigned College</label>
          <select
            value={selectedCampus}
            onChange={(e) => {
              setSelectedCampus(e.target.value);
              showSuccess(`Active campus node switched to ${e.target.value}`);
            }}
            className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          >
            <option value="Bharti Vidyapeeth College of Engineering (Pune - Main Campus)">
              Bharti Vidyapeeth College of Engineering (Pune - Main Campus)
            </option>
            <option value="Bharti Vidyapeeth College of Engineering (New Delhi)">
              Bharti Vidyapeeth College of Engineering (New Delhi)
            </option>
            <option value="Bharti Vidyapeeth College of Engineering (Navi Mumbai)">
              Bharti Vidyapeeth College of Engineering (Navi Mumbai)
            </option>
          </select>
        </div>
      </div>

      {/* Offline Storage Settings */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-xs space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-emerald-600" />
          <span>Local Device Storage (IndexedDB)</span>
        </h3>

        <div className="p-3 bg-gray-50 rounded-lg text-xs space-y-1.5 border border-gray-100">
          <div className="flex items-center justify-between text-gray-600">
            <span>Allocated Course Storage:</span>
            <span className="font-semibold text-gray-900">4.2 MB / 50 MB (8%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '8%' }} />
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={offlinePreloadNotes}
              onChange={(e) => setOfflinePreloadNotes(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-800">
              Preload syllabus notes automatically when connecting to campus Wi-Fi
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={effectiveOffline}
              onChange={toggleSimulatedOffline}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-800">
              Simulate offline airplane mode (test local mesh and cached courseware)
            </span>
          </label>
        </div>

        <div className="pt-2">
          <button
            onClick={handleClearCache}
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Clear Cached Files
          </button>
        </div>
      </div>

      {/* App Version Info */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-xs text-xs text-gray-500 flex items-center justify-between">
        <div>
          <span className="font-semibold text-gray-800 block">SkillMesh Architecture</span>
          <span>Offline-first progressive web application · Academic Edition</span>
        </div>
        <span className="font-mono text-gray-400">v{APP_VERSION}</span>
      </div>
    </div>
  );
};
