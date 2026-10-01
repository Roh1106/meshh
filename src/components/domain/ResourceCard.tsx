import React from 'react';
import { FileText, Download, CheckCircle, Star, ArrowDownToLine, Bookmark, BookmarkCheck } from 'lucide-react';
import { AcademicResource } from '../../types';
import { Badge } from '../ui/Badge';

interface ResourceCardProps {
  resource: AcademicResource;
  onSaveOffline?: (resource: AcademicResource) => void;
  onView?: (resource: AcademicResource) => void;
  onBookmark?: (resource: AcademicResource) => void;
  onOpenPdf?: (resource: AcademicResource) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onSaveOffline,
  onView,
  onBookmark,
  onOpenPdf,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-xs transition-shadow hover:shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-start gap-3">
          {/* Document Icon Box */}
          <div
            onClick={() => {
              if (onOpenPdf) onOpenPdf(resource);
              else onView?.(resource);
            }}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 cursor-pointer border border-blue-100 hover:bg-blue-100 transition-colors"
            title="Click to Open PDF"
          >
            <FileText className="w-6 h-6" />
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap text-xs text-gray-500 font-mono">
              <span className="font-bold text-gray-900">{resource.subject}</span>
              <span>·</span>
              <span>{resource.format} ({resource.fileSize})</span>
              <span>·</span>
              <span>{resource.semester}</span>
              {resource.isOfflineAvailable && (
                <>
                  <span>·</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/70 inline-flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Downloaded</span>
                  </span>
                </>
              )}
            </div>

            <h3
              onClick={() => {
                if (onOpenPdf) onOpenPdf(resource);
                else onView?.(resource);
              }}
              className="text-sm sm:text-base font-semibold text-gray-900 mt-1 cursor-pointer hover:text-blue-600 transition-colors leading-snug line-clamp-1"
            >
              {resource.title}
            </h3>

            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5 leading-normal">
              {resource.description}
            </p>
          </div>

          {onBookmark && (
            <button
              type="button"
              onClick={() => onBookmark(resource)}
              aria-label="Bookmark resource"
              className="text-gray-400 hover:text-blue-600 p-1 -mr-1 rounded transition-colors"
            >
              {resource.isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-blue-600" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Bottom stats and Open / Save Offline Action Strip */}
      <div className="mt-3.5 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50/80 px-3 py-2 rounded-lg border border-gray-100 text-xs">
        <div className="flex items-center gap-3 text-gray-500 text-[11px]">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <strong className="text-gray-900">{resource.rating.toFixed(1)}</strong>
            <span>({resource.ratingsCount})</span>
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Download className="w-3.5 h-3.5" />
            <span>{resource.downloadCount} downloads</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
          {/* Prominent Open PDF Button */}
          <button
            type="button"
            onClick={() => {
              if (onOpenPdf) onOpenPdf(resource);
              else onView?.(resource);
            }}
            className="h-7 px-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors"
            title="Open and read document in Academic PDF Reader"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Open PDF</span>
          </button>

          {onSaveOffline && (
            <button
              type="button"
              onClick={() => onSaveOffline(resource)}
              className={`h-7 px-2.5 rounded-md text-xs font-medium flex items-center gap-1 transition-all border ${
                resource.isOfflineAvailable
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              title={resource.isOfflineAvailable ? 'Cached in device memory' : 'Save for offline revision'}
            >
              {resource.isOfflineAvailable ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Downloaded</span>
                </>
              ) : (
                <>
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  <span>Save</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
