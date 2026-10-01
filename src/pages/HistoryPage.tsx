import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { historyService } from '../services/historyService';
import { HistoryItem } from '../types';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { Trash2, FileText, CheckCircle, HelpCircle, RefreshCw, BookOpen, Clock } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const HistoryPage: React.FC = () => {
  const { showSuccess } = useToast();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await historyService.getHistory();
        if (mounted) setHistory(data);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleClearHistory = async () => {
    await historyService.clearHistory();
    setHistory([]);
    setIsClearModalOpen(false);
    showSuccess('Activity history cleared from this device.');
  };

  const getItemIcon = (type: HistoryItem['type']) => {
    switch (type) {
      case 'viewed_resource':
      case 'uploaded_resource':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'mentoring_session':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'asked_question':
      case 'answered_question':
        return <HelpCircle className="w-4 h-4 text-amber-600" />;
      case 'sync_event':
        return <RefreshCw className="w-4 h-4 text-purple-600" />;
      case 'attempted_test':
        return <BookOpen className="w-4 h-4 text-emerald-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const groups: ('Today' | 'Yesterday' | 'This week' | 'Older')[] = [
    'Today',
    'Yesterday',
    'This week',
    'Older',
  ];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Activity History"
        description="Local log of course materials viewed, tests attempted, peer sessions, and mesh sync milestones."
        action={
          history.length > 0 ? (
            <button
              onClick={() => setIsClearModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          ) : null
        }
      />

      {history.length === 0 ? (
        <EmptyState
          title="History is empty"
          description="Your peer learning interactions, test scores, and downloads will appear here organized by date."
        />
      ) : (
        <div className="space-y-6">
          {groups.map((group) => {
            const items = history.filter((h) => h.dateGroup === group);
            if (items.length === 0) return null;

            return (
              <div key={group} className="space-y-2">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
                  {group}
                </h3>
                <div className="bg-white rounded-xl border border-gray-200/90 divide-y divide-gray-100 shadow-xs">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-200/60 mt-0.5">
                          {getItemIcon(item.type)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 leading-snug">{item.title}</p>
                          {item.details && (
                            <p className="text-gray-500 text-[11px] mt-0.5">{item.details}</p>
                          )}
                          <span className="text-gray-400 text-[10px] mt-1 block">
                            {item.timestamp}
                          </span>
                        </div>
                      </div>
                      {item.status && (
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-medium shrink-0">
                          {item.status}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Clear History Confirmation Modal */}
      <ConfirmDialog
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleClearHistory}
        title="Clear Activity History?"
        message="This will remove your local viewing logs and session timeline from this browser. Your saved bookmarks, offline files, and profile karma will NOT be affected."
        confirmLabel="Clear History"
        isDestructive
      />
    </div>
  );
};
