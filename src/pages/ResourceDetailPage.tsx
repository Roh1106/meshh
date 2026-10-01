import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { resourceService } from '../services/resourceService';
import { AcademicResource } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import {
  FileText,
  Download,
  CheckCircle,
  Star,
  ArrowDownToLine,
  Share2,
  Calendar,
  Building,
  User,
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { PdfViewerModal, PdfDocument } from '../components/common/PdfViewerModal';

export const ResourceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showInfo } = useToast();

  const [resource, setResource] = useState<AcademicResource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchRes = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const item = await resourceService.getResourceById(id);
        if (mounted) {
          if (item) setResource(item);
          else setError('Resource not found in campus database.');
        }
      } catch (err) {
        if (mounted) setError('Failed to load resource details.');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchRes();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (isLoading) return <Spinner size="lg" className="py-20" />;

  if (error || !resource) {
    return (
      <div className="py-10">
        <ErrorState
          title="Document Unavailable"
          message={error || 'Unable to locate this document.'}
          onRetry={() => navigate('/resources')}
        />
      </div>
    );
  }

  const handleToggleOffline = async () => {
    const isOffline = await resourceService.toggleOfflineSave(resource.id);
    setResource({ ...resource, isOfflineAvailable: isOffline });
    if (isOffline) {
      showSuccess(`Saved "${resource.title}" for offline exam preparation.`);
    } else {
      showInfo(`Removed "${resource.title}" from local device cache.`);
    }
  };

  const handleToggleBookmark = async () => {
    const isSaved = await resourceService.toggleBookmark(resource.id);
    setResource({ ...resource, isSaved });
    showInfo(isSaved ? 'Bookmarked resource.' : 'Removed from bookmarks.');
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader title={resource.title} backTo="/resources" />

      {/* Main Resource Header Card */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                {resource.verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{resource.verifiedBy || 'Faculty Approved'}</span>
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-medium">
                  {resource.format} · {resource.fileSize}
                </span>
                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs font-medium">
                  {resource.semester}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mt-1.5 leading-snug">
                {resource.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{resource.subject}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleToggleBookmark}
              className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
              title="Bookmark"
            >
              {resource.isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-blue-600" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsPdfModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors"
              title="Open and read in academic PDF viewer"
            >
              <FileText className="w-4 h-4" />
              <span>Open PDF</span>
            </button>

            <button
              onClick={handleToggleOffline}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                resource.isOfflineAvailable
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-2xs'
              }`}
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>{resource.isOfflineAvailable ? 'Downloaded ✓' : 'Save Offline'}</span>
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="pt-2 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Summary & Scope
          </h3>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            {resource.description}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 border border-gray-100">
          <div>
            <span className="text-gray-400 block text-[11px]">Author</span>
            <span className="font-semibold text-gray-900">{resource.author}</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[11px]">Department</span>
            <span className="font-semibold text-gray-900">{resource.department}</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[11px]">Peer Rating</span>
            <span className="font-semibold text-gray-900 flex items-center gap-1 mt-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{resource.rating.toFixed(1)} / 5.0 ({resource.ratingsCount})</span>
            </span>
          </div>
          <div>
            <span className="text-gray-400 block text-[11px]">Downloads</span>
            <span className="font-semibold text-gray-900">{resource.downloadCount} students</span>
          </div>
        </div>
      </div>

      {/* Document Reader Callout */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-6 text-center space-y-3">
        <div className="max-w-md mx-auto space-y-2">
          <p className="text-sm font-semibold text-gray-900">
            Document Ready for Offline Study
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            In offline mode, SkillMesh accesses this content directly from local browser storage without requiring internet connectivity.
          </p>
        </div>
        <button
          onClick={() => setIsPdfModalOpen(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-2 shadow-2xs"
        >
          <FileText className="w-4 h-4" />
          <span>Open Fullscreen Academic PDF Reader</span>
        </button>
      </div>

      {/* Fullscreen Academic PDF Reader Modal */}
      <PdfViewerModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        document={
          resource
            ? {
                id: resource.id,
                title: resource.title,
                subject: resource.subject,
                department: resource.department,
                fileSize: resource.fileSize,
                authorOrSource: `${resource.author} · ${resource.department}`,
              }
            : null
        }
      />
    </div>
  );
};
