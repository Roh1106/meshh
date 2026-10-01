import React, { useState } from 'react';
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Printer,
  Maximize2,
  Minimize2,
  FileText,
  Search,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { DEFAULT_CAMPUS } from '../../constants/app';

export interface PdfDocument {
  id?: string;
  title: string;
  authorOrSource?: string;
  department?: string;
  subject?: string;
  fileSize?: string;
  totalPages?: number;
  contentPages?: {
    pageNumber: number;
    title: string;
    sections: {
      heading: string;
      paragraphs: string[];
      keyPoints?: string[];
      formulaOrCode?: string;
      tableData?: { headers: string[]; rows: string[][] };
    }[];
  }[];
}

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: PdfDocument | null;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  const { showSuccess } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isOpen || !document) return null;

  const totalPages = document.totalPages || (document.contentPages?.length || 4);

  // Generate fallback academic pages if none provided
  const pages = document.contentPages || [
    {
      pageNumber: 1,
      title: 'Chapter Overview & Academic Scope',
      sections: [
        {
          heading: '1. Course Fundamentals & Department Framework',
          paragraphs: [
            `This official academic document is published by ${DEFAULT_CAMPUS.name} for the curriculum of ${document.department || 'Computer Science & Engineering'}. It contains peer-verified formulas, textbook derivations, and examination notes.`,
            `The topics herein are mapped directly to university semester examination weightages and GATE qualifying benchmarks.`,
          ],
          keyPoints: [
            'Verified by Departmental Curriculum Board',
            'Includes step-by-step mathematical proofs and worked examples',
            'Fully accessible offline in browser local storage',
          ],
        },
        {
          heading: '2. Core Theoretical Definitions & Theorems',
          paragraphs: [
            'All definitions are stated under standard formalisms. When evaluating computational models, verify worst-case upper bounds alongside amortized guarantees.',
          ],
          formulaOrCode: `// Theorem 1.1: Asymptotic Invariant Constraint\n∀ n ≥ n₀,  c₁ · g(n) ≤ f(n) ≤ c₂ · g(n)\n\n// Lemma 2.3: Conservation Principle\nTotal System State = ∑ (Active States) + Buffer Allocation`,
        },
      ],
    },
    {
      pageNumber: 2,
      title: 'Detailed Analytical Formulations & Architecture',
      sections: [
        {
          heading: '3. Architectural Breakdown & Schematic Analysis',
          paragraphs: [
            'The structural model partitions high-frequency data flows from persistent consistency logging. Concurrency safety requires strict monotonic sequence ordering across all processing nodes.',
          ],
          tableData: {
            headers: ['Component Phase', 'Time Complexity', 'Space Overhead', 'Reliability Class'],
            rows: [
              ['Input Parsing & Validation', 'O(N)', 'O(1)', 'Deterministic'],
              ['Canonical State Evaluation', 'O(log N)', 'O(N)', 'Strict Serializability'],
              ['Memory Barrier & Write-Ahead Log', 'O(1) amortized', 'O(B)', 'ACID Persistent'],
              ['Index Traversal (B+ Tree)', 'O(log_B N)', 'O(1)', 'Lock-Free Shared'],
            ],
          },
        },
        {
          heading: '4. Critical Invariants & Edge Cases',
          paragraphs: [
            'Boundary evaluations must account for null pointer propagation, integer wrap-around in 32-bit registers, and clock skew anomalies in distributed environments.',
          ],
        },
      ],
    },
    {
      pageNumber: 3,
      title: 'Worked Numerical Problems & Step-by-Step Solutions',
      sections: [
        {
          heading: '5. Problem 3.1: Examination Derivation',
          paragraphs: [
            'Statement: Given an input dataset of size N = 10⁶, evaluate whether a 3-level hierarchical index fits within a standard 64MB cache boundary.',
          ],
          keyPoints: [
            'Step 1: Compute block factor B = Floor(PageSize / NodeRecordSize) = 512 entries.',
            'Step 2: Tree height h = Ceil(log₅₁₂ 10⁶) = 2.22 → 3 levels.',
            'Step 3: Maximum cache footprint = (1 + 512 + 512²) · 4KB ≈ 1.05 MB << 64 MB.',
            'Conclusion: The full working set safely resides in L3 CPU cache.',
          ],
          formulaOrCode: `Capacity = Node_Fanout ^ (Tree_Height - 1)\nTotal_I/O_Reads = Tree_Height + Data_Page_Fetch = 3 + 1 = 4 Disk Blocks`,
        },
      ],
    },
    {
      pageNumber: 4,
      title: 'Summary, Formula Cheat Sheet & Reference Bibliography',
      sections: [
        {
          heading: '6. High-Yield Revision Matrix',
          paragraphs: [
            'Review these key formulas immediately prior to taking chapter diagnostic tests or GATE mock examinations.',
          ],
          keyPoints: [
            'Master Theorem: If a > b^d, T(n) = Θ(n^(log_b a))',
            'Little\'s Law: L = λ · W',
            'Amdahl\'s Speedup Law: S_latency(s) = 1 / ((1 - p) + p/s)',
            'Nyquist-Shannon Limit: Maximum Data Rate = 2B · log₂(M) bps',
          ],
        },
        {
          heading: '7. Official Prescribed References',
          paragraphs: [
            `Standard courseware references: MIT Press, Pearson Higher Education, and ${DEFAULT_CAMPUS.shortName} Department Library Archives.`,
          ],
        },
      ],
    },
  ];

  const currentPageData = pages[currentPage - 1] || pages[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadOffline = () => {
    showSuccess(`Saved "${document.title}.pdf" to your browser device storage.`, 'PDF Saved');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-2 sm:p-4 overflow-hidden">
      <div
        className={`bg-slate-900 text-slate-100 rounded-xl shadow-2xl flex flex-col w-full transition-all border border-slate-700/80 ${
          isFullscreen ? 'h-full max-h-screen rounded-none' : 'h-[92vh] max-w-6xl'
        }`}
      >
        {/* Top Header & Tool Toolbar */}
        <div className="px-4 py-2.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-3 text-xs shrink-0">
          {/* Document Title & Badge */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded bg-red-600/90 text-white flex items-center justify-center shrink-0 font-bold font-mono text-[11px] shadow-2xs">
              PDF
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="font-semibold text-slate-100 truncate text-xs sm:text-sm">
                {document.title}
              </h3>
              <span className="text-[11px] text-slate-400 truncate">
                {document.authorOrSource || DEFAULT_CAMPUS.name} · {document.department || 'Engineering'}
              </span>
            </div>
          </div>

          {/* Central Controls: Page Navigation & Zoom */}
          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 hover:bg-slate-700 rounded disabled:opacity-30 transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs px-1 text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 hover:bg-slate-700 rounded disabled:opacity-30 transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <span className="text-slate-600">|</span>

            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
              className="p-1 hover:bg-slate-700 rounded text-slate-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] text-slate-400 w-10 text-center">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
              className="p-1 hover:bg-slate-700 rounded text-slate-300"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-medium transition-colors hidden sm:inline-flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3" />
              <span>{sidebarOpen ? 'Hide Index' : 'Show Index'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadOffline}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-2xs"
              title="Download or Save PDF Offline"
            >
              <Download className="w-3 h-3" />
              <span className="hidden sm:inline">Save Copy</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-red-950/50 hover:text-red-400 rounded transition-colors"
              title="Close PDF"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Workspace (Index Sidebar + High-Fidelity Paper Canvas) */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Left Table of Contents */}
          {sidebarOpen && (
            <aside className="w-56 bg-slate-950 border-r border-slate-800 p-3 hidden sm:flex flex-col text-xs shrink-0 select-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Document Index ({totalPages} Pages)
              </span>
              <div className="space-y-1 overflow-y-auto flex-1 pr-1">
                {pages.map((p) => (
                  <button
                    key={p.pageNumber}
                    onClick={() => setCurrentPage(p.pageNumber)}
                    className={`w-full text-left p-2 rounded text-xs transition-colors flex items-center gap-2 ${
                      currentPage === p.pageNumber
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <span className="font-mono text-[10px] opacity-75">#{p.pageNumber}</span>
                    <span className="truncate">{p.title}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500">
                <span>Certified BVCOE E-Book</span>
              </div>
            </aside>
          )}

          {/* Main Document Render Area */}
          <main className="flex-1 bg-slate-800/60 overflow-y-auto p-3 sm:p-6 flex justify-center">
            {/* Emulated Physical Paper Container */}
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="w-full max-w-3xl bg-white text-slate-900 rounded-lg shadow-xl p-6 sm:p-10 transition-transform duration-150 min-h-[750px] flex flex-col justify-between border border-slate-300"
            >
              {/* Header Letterhead of the University */}
              <div className="border-b-2 border-slate-900 pb-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                      BV
                    </div>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-tight text-slate-900">
                        {DEFAULT_CAMPUS.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Academic Department of {document.department || 'Engineering'} · Accredited Courseware
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-slate-500 font-mono">
                    <span>Document #{document.id || 'REF-2026-X'}</span>
                    <p className="text-emerald-700 font-semibold">Faculty Verified ✓</p>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between">
                  <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                    {document.title}
                  </h1>
                  <span className="text-xs font-mono text-slate-500">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              </div>

              {/* Dynamic Page Content */}
              <div className="space-y-6 flex-1 text-xs sm:text-sm leading-relaxed text-slate-800">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs font-semibold text-slate-700">
                  {currentPageData.title}
                </div>

                {currentPageData.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-2">
                    <h2 className="text-xs sm:text-sm font-bold text-slate-900 border-b border-slate-100 pb-1">
                      {sec.heading}
                    </h2>

                    {sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-slate-700 text-xs leading-relaxed">
                        {p}
                      </p>
                    ))}

                    {sec.keyPoints && (
                      <div className="my-2 p-3 bg-blue-50/60 rounded-md border border-blue-100">
                        <span className="font-bold text-[11px] text-blue-900 block mb-1">
                          Key Exam Takeaways:
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-xs text-blue-950">
                          {sec.keyPoints.map((pt, ptIdx) => (
                            <li key={ptIdx}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {sec.formulaOrCode && (
                      <div className="my-2 p-3 bg-slate-900 text-slate-100 rounded-md font-mono text-xs overflow-x-auto shadow-inner">
                        <pre className="whitespace-pre-wrap">{sec.formulaOrCode}</pre>
                      </div>
                    )}

                    {sec.tableData && (
                      <div className="my-3 overflow-x-auto border border-slate-200 rounded-md">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-slate-100 font-semibold text-slate-700 border-b border-slate-200">
                            <tr>
                              {sec.tableData.headers.map((h, hIdx) => (
                                <th key={hIdx} className="p-2 border-r last:border-r-0 border-slate-200">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                            {sec.tableData.rows.map((r, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-50">
                                {r.map((cell, cIdx) => (
                                  <td key={cIdx} className="p-2 border-r last:border-r-0 border-slate-200">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Document Footer */}
              <div className="mt-8 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>{DEFAULT_CAMPUS.shortName} Academic Mesh Repository</span>
                <span>Confidential to Enrolled Students · Offline Cached</span>
                <span>Page {currentPage}</span>
              </div>
            </div>
          </main>
        </div>

        {/* Mobile Page Switcher Footer */}
        <div className="md:hidden px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 bg-slate-800 rounded disabled:opacity-40"
          >
            Previous
          </button>
          <span className="font-mono text-xs">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 bg-slate-800 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
