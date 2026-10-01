import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { savedService } from '../services/savedService';
import { SavedItem } from '../types';
import { EmptyState } from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/Skeleton';
import { Bookmark, FileText, HelpCircle, Users, Trash2, ArrowRight, BookOpen, Download } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { PdfViewerModal, PdfDocument } from '../components/common/PdfViewerModal';

export const SavedPage: React.FC = () => {
  const navigate = useNavigate();
  const { showInfo } = useToast();

  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'resource' | 'question' | 'peer' | 'session'>('all');
  const [selectedPdf, setSelectedPdf] = useState<PdfDocument | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await savedService.getSavedItems(filterType);
        if (mounted) setSavedItems(data);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [filterType]);

  const handleRemove = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await savedService.removeItem(id);
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
    showInfo('Removed item from saved list.');
  };

  const handleOpenPdf = (item: SavedItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedPdf({
      id: item.originalId,
      title: item.title,
      subject: item.metadata?.split('·')[0]?.trim() || 'Academic Course Material',
      department: item.metadata || 'Computer Science & Engineering',
      fileSize: '1.8 MB',
      authorOrSource: item.subtitle,
    });
  };

  const handleNavigate = (item: SavedItem) => {
    switch (item.type) {
      case 'resource':
        handleOpenPdf(item);
        break;
      case 'question':
        navigate(`/questions/${item.originalId}`);
        break;
      case 'peer':
        navigate('/discover');
        break;
      case 'session':
        navigate('/sessions');
        break;
    }
  };

  const getTypeIcon = (type: SavedItem['type']) => {
    switch (type) {
      case 'resource':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'question':
        return <HelpCircle className="w-4 h-4 text-amber-600" />;
      case 'peer':
      case 'session':
        return <Users className="w-4 h-4 text-emerald-600" />;
    }
  };

  const tabs: { id: 'all' | 'resource' | 'question' | 'peer' | 'session'; label: string }[] = [
    { id: 'all', label: 'All Saved' },
    { id: 'resource', label: 'Downloaded Books & PDFs' },
    { id: 'peer', label: 'Peers' },
    { id: 'question', label: 'Questions' },
    { id: 'session', label: 'Sessions' },
  ];

  return (
    <div className="space-y-4 pb-12">
      <PageHeader
        title="Saved Items & Downloaded Books"
        description="Bookmarked academic books, notes, peer profiles, and questions kept offline for fast study."
      />

      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterType === tab.id
                ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 pt-2">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : savedItems.length === 0 ? (
          <EmptyState
            title="No saved items yet"
            description="Bookmark resources, peers, or questions across the app to review them later."
            actionLabel="Discover Materials"
            onAction={() => navigate('/discover')}
          />
        ) : (
          savedItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNavigate(item)}
              className="bg-white rounded-xl border border-gray-200/90 p-3.5 shadow-xs hover:border-gray-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div
                  onClick={(e) => {
                    if (item.type === 'resource') {
                      e.stopPropagation();
                      handleOpenPdf(item);
                    }
                  }}
                  className="p-2.5 rounded-lg bg-gray-50 border border-gray-200/70 shrink-0 mt-0.5 hover:bg-blue-50 transition-colors"
                  title={item.type === 'resource' ? 'Click to open PDF' : undefined}
                >
                  {getTypeIcon(item.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                      {item.type === 'resource' ? 'Academic Book / PDF' : item.type}
                    </span>
                    {item.type === 'resource' && (
                      <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                        Downloaded
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 truncate mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">{item.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                {/* Dedicated Open PDF button for downloaded books & resources */}
                {item.type === 'resource' && (
                  <button
                    type="button"
                    onClick={(e) => handleOpenPdf(item, e)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                    title="Open document in Academic PDF Reader"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Open PDF</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => handleRemove(item.id, e)}
                  aria-label="Remove saved item"
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-gray-100 transition-colors"
                  title="Remove from saved items"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ArrowRight className="w-4 h-4 text-gray-400 hidden sm:block" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Fullscreen Academic PDF Reader Modal */}
      <PdfViewerModal
        document={selectedPdf}
        isOpen={!!selectedPdf}
        onClose={() => setSelectedPdf(null)}
      />
    </div>
  );
};
