import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { ResourceCard } from '../components/domain/ResourceCard';
import { SearchBar } from '../components/ui/SearchBar';
import { EmptyState } from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/Skeleton';
import { resourceService } from '../services/resourceService';
import { resourcesRepository, karmaRepository, historyRepository } from '../repositories';
import { resourceValidationService } from '../services/resourceValidationService';
import { AcademicResource, ResourceReportReason } from '../types';
import { useToast } from '../context/ToastContext';
import { ArrowDownToLine, CheckCircle2, Upload, Filter, AlertTriangle, ShieldCheck, Flag } from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { PdfViewerModal, PdfDocument } from '../components/common/PdfViewerModal';

export const ResourcesPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showInfo, showError, showWarning } = useToast();

  const [resources, setResources] = useState<AcademicResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('All Formats');
  const [offlineOnly, setOfflineOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Upload Flow State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSubject, setNewSubject] = useState('DBMS');
  const [newTopic, setNewTopic] = useState('');
  const [newSemester, setNewSemester] = useState('Semester 4');
  const [newDepartment, setNewDepartment] = useState('Computer Science & Eng.');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // PDF Viewer State
  const [selectedPdf, setSelectedPdf] = useState<PdfDocument | null>(null);

  // Report Modal State
  const [reportResource, setReportResource] = useState<AcademicResource | null>(null);
  const [reportReason, setReportReason] = useState<ResourceReportReason>('incorrect_content');
  const [reportNotes, setReportNotes] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await resourceService.getResources({
          query: searchQuery,
          format: selectedFormat,
          offlineOnly,
          verifiedOnly,
        });
        if (mounted) setResources(data);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [searchQuery, selectedFormat, offlineOnly, verifiedOnly]);

  const handleToggleOffline = async (res: AcademicResource) => {
    const isOffline = await resourceService.toggleOfflineSave(res.id);
    setResources((prev) =>
      prev.map((r) => (r.id === res.id ? { ...r, isOfflineAvailable: isOffline } : r))
    );
    if (isOffline) {
      showSuccess(`Saved "${res.title}" to local device cache.`, 'Offline Ready');
    } else {
      showInfo(`Removed "${res.title}" from offline storage.`);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);
    setValidationWarnings([]);

    if (!uploadFile) {
      setValidationErrors(['Please select an authentic academic PDF file to upload.']);
      return;
    }

    setIsUploading(true);

    try {
      // 1. Pipeline validation: extension, MIME, size, SHA-256 fingerprint, duplicate check
      const validation = await resourceValidationService.validateAndPrepare({
        file: uploadFile,
        title: newTitle,
        description: newDescription,
        subject: newSubject,
        topic: newTopic,
        semester: newSemester,
        department: newDepartment,
        language: 'English',
        authorName: 'Rohan Ranmale (Student Contributor)',
      });

      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        setIsUploading(false);
        return;
      }

      if (validation.warnings.length > 0) {
        setValidationWarnings(validation.warnings);
      }

      // 2. Build resource record
      const newResource: AcademicResource = {
        id: `res_${Date.now()}`,
        title: newTitle.trim(),
        subject: newSubject,
        topic: newTopic.trim() || 'General Coursework',
        format: 'PDF',
        fileSize: validation.fileSizeFormatted,
        semester: newSemester,
        department: newDepartment,
        language: 'English',
        verified: validation.status === 'Verified',
        verifiedBy: validation.status === 'Verified' ? 'Automated Topic Match' : 'Pending Peer Review',
        rating: 5.0,
        ratingsCount: 1,
        downloadCount: 1,
        author: 'Rohan Ranmale',
        authorRole: '3rd Year Contributor',
        updatedAt: 'Just now',
        description: newDescription.trim(),
        isSaved: true,
        isOfflineAvailable: true,
      };

      // 3. Save into local repository
      await resourcesRepository.save(newResource);

      // 4. Log Karma Transaction (+15 for resource contribution)
      await karmaRepository.addTransaction({
        userId: 'current_user',
        amount: 15,
        action: 'resource_contribution',
        description: `Contributed academic PDF notes: ${newResource.title}`,
        referenceId: newResource.id,
      });

      // 5. Append to Activity History
      await historyRepository.addEvent({
        type: 'uploaded_resource',
        title: `Contributed: ${newResource.title}`,
        timestamp: 'Just now',
        dateGroup: 'Today',
        status: validation.status,
        details: `${newResource.subject} · ${newResource.fileSize}`,
      });

      // Refresh list
      setResources((prev) => [newResource, ...prev]);
      showSuccess(
        `Resource "${newTitle}" verified and saved locally. +15 Karma awarded!`,
        'Upload Successful'
      );

      // Reset form
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setNewTitle('');
      setNewDescription('');
      setNewTopic('');
      setValidationErrors([]);
      setValidationWarnings([]);
    } catch (err) {
      showError('Failed to process upload. Your local data remains safe.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportResource) return;
    showSuccess(
      `Report for "${reportResource.title}" logged under category "${reportReason}". Sent for moderation.`,
      'Report Submitted'
    );
    setReportResource(null);
    setReportNotes('');
  };

  return (
    <div className="space-y-4 pb-12">
      <PageHeader
        title="Academic Resources"
        description="Peer-validated course notes, faculty-approved cheat sheets, and lab guides with offline storage."
        action={
          <button
            onClick={() => {
              setValidationErrors([]);
              setValidationWarnings([]);
              setIsUploadModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Contribute Notes</span>
          </button>
        }
      />

      {/* Search and Filters */}
      <div className="space-y-2.5">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by topic, subject (e.g. DBMS, OS, Networks) or faculty name..."
        />

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 text-xs">
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="px-2.5 py-1 rounded-md bg-white text-gray-700 font-medium border border-gray-200 focus:outline-none cursor-pointer"
          >
            <option value="All Formats">All Formats</option>
            <option value="PDF">PDF Only</option>
            <option value="NOTES">Handwritten Notes</option>
            <option value="ZIP">Code / Lab Archives</option>
          </select>

          <button
            onClick={() => setOfflineOnly(!offlineOnly)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium border transition-colors ${
              offlineOnly
                ? 'bg-blue-50 text-blue-800 border-blue-300'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>Saved Offline Only</span>
          </button>

          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium border transition-colors ${
              verifiedOnly
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Faculty Verified Only</span>
          </button>
        </div>

        {offlineOnly && (
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-950">
            <div className="flex items-center gap-2">
              <ArrowDownToLine className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>Downloaded Books & Offline Cache:</strong> Showing books & guides saved to your device. Click <strong>Open PDF</strong> to view any document immediately.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOfflineOnly(false)}
              className="text-xs text-emerald-800 underline font-semibold hover:text-emerald-950 ml-2 shrink-0"
            >
              Show all
            </button>
          </div>
        )}
      </div>

      {/* Resource Cards Feed */}
      <div className="flex flex-col gap-3 pt-2">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : resources.length === 0 ? (
          <EmptyState
            title="No matching academic resources"
            description="Try changing your search terms or unchecking the 'Saved Offline Only' filter."
            actionLabel="Reset Search"
            onAction={() => {
              setSearchQuery('');
              setSelectedFormat('All Formats');
              setOfflineOnly(false);
              setVerifiedOnly(false);
            }}
          />
        ) : (
          resources.map((res) => (
            <div key={res.id} className="relative group">
              <ResourceCard
                resource={res}
                onSaveOffline={handleToggleOffline}
                onView={(r) => navigate(`/resources/${r.id}`)}
                onOpenPdf={(r) =>
                  setSelectedPdf({
                    id: r.id,
                    title: r.title,
                    subject: r.subject,
                    department: r.department,
                    fileSize: r.fileSize,
                    authorOrSource: `${r.author} (${r.authorRole || 'Faculty / Senior'})`,
                  })
                }
              />
              <button
                type="button"
                onClick={() => setReportResource(res)}
                className="absolute top-4 right-10 opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-amber-600 transition-opacity"
                title="Report inaccurate or unreadable content"
              >
                <Flag className="w-3.5 h-3.5" />
              </button>
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

      {/* Structured Resource Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Contribute Academic PDF Material"
        description="Every uploaded resource undergoes format validation, duplicate detection, and topic alignment."
        maxWidth="lg"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs sm:text-sm">
          {validationErrors.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-1 text-xs text-red-800">
              <span className="font-semibold block">Validation Failed:</span>
              <ul className="list-disc list-inside space-y-0.5">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {validationWarnings.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-1 text-xs text-amber-900">
              <div className="flex items-center gap-1.5 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Notice:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5">
                {validationWarnings.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Select Academic PDF File *
            </label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              required
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setUploadFile(file);
                if (file && !newTitle) {
                  setNewTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
                }
              }}
              className="w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-[11px] text-gray-400 mt-1">Maximum file size: 25 MB. Authenticated PDF documents only.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Resource Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Operating Systems Concurrency & Semaphores Guide"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              What does this resource cover? (Detailed Summary) *
            </label>
            <textarea
              required
              rows={2}
              placeholder="Explain the concepts, theorems, or question papers covered in this PDF..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Specific Topic
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Concurrency & Deadlocks"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Semester
              </label>
              <select
                value={newSemester}
                onChange={(e) => setNewSemester(e.target.value)}
                className="w-full h-9 rounded-lg border border-gray-300 px-2 text-xs sm:text-sm bg-white"
              >
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
                <option value="Semester 7">Semester 7</option>
                <option value="Semester 8">Semester 8</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Department
              </label>
              <select
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="w-full h-9 rounded-lg border border-gray-300 px-2 text-xs sm:text-sm bg-white"
              >
                <option value="Computer Science & Eng.">Computer Science & Eng.</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Comm. (ECE)">Electronics & Comm. (ECE)</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              Validated contributions earn <strong>+15 Karma</strong> and become accessible to all nearby campus students via ad-hoc local mesh.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="w-full h-9 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="w-full h-9 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-2xs disabled:opacity-50"
            >
              {isUploading ? 'Validating & Fingerprinting...' : 'Validate & Publish'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Report Modal */}
      <Modal
        isOpen={!!reportResource}
        onClose={() => setReportResource(null)}
        title="Report Academic Material"
        description="Help maintain quality and academic integrity in the campus library."
      >
        <form onSubmit={handleReportSubmit} className="space-y-3 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Reason for Report
            </label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value as ResourceReportReason)}
              className="w-full h-9 rounded-lg border border-gray-300 px-2 text-xs sm:text-sm bg-white"
            >
              <option value="incorrect_content">Incorrect or inaccurate content</option>
              <option value="duplicate">Duplicate of an existing resource</option>
              <option value="misleading_title">Misleading title or metadata</option>
              <option value="unreadable_file">Unreadable or corrupted PDF</option>
              <option value="academic_integrity">Academic integrity violation</option>
              <option value="inappropriate_content">Inappropriate content</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Additional Details
            </label>
            <textarea
              rows={2}
              placeholder="Explain the specific issue with this resource..."
              value={reportNotes}
              onChange={(e) => setReportNotes(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setReportResource(null)}
              className="w-full h-9 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full h-9 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-2xs"
            >
              Submit Report
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

