import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { DetailedCourseSyllabus, courseService, Course } from '../../services/courseService';
import {
  BookOpen,
  FileText,
  Clock,
  Award,
  Layers,
  CheckCircle,
  Download,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  GraduationCap,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { DEFAULT_CAMPUS } from '../../constants/app';
import { useNavigate } from 'react-router-dom';
import { PdfViewerModal, PdfDocument } from '../common/PdfViewerModal';

interface CourseSyllabusModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onEnroll?: (course: Course) => void;
  isEnrolled?: boolean;
}

export const CourseSyllabusModal: React.FC<CourseSyllabusModalProps> = ({
  course,
  isOpen,
  onClose,
  onEnroll,
  isEnrolled,
}) => {
  const { showSuccess } = useToast();
  const navigate = useNavigate();
  const [syllabus, setSyllabus] = useState<DetailedCourseSyllabus | null>(null);
  const [activeUnitNumber, setActiveUnitNumber] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState<'units' | 'evaluation' | 'textbooks' | 'practicals'>('units');
  const [loading, setLoading] = useState(false);
  const [activePdfBook, setActivePdfBook] = useState<PdfDocument | null>(null);

  useEffect(() => {
    if (course && isOpen) {
      setLoading(true);
      courseService
        .getCourseSyllabus(course.id)
        .then((data) => {
          setSyllabus(data);
          setActiveUnitNumber(1);
        })
        .finally(() => setLoading(false));
    }
  }, [course, isOpen]);

  if (!course) return null;

  const handleDownloadSyllabus = () => {
    showSuccess(
      `Official Syllabus Outline for ${course.code} saved for offline study.`,
      'Syllabus Downloaded'
    );
  };

  return (
    <>
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${course.code} · ${course.title}`}
      description={`${DEFAULT_CAMPUS.name} · ${course.department} (${course.semester})`}
      maxWidth="xl"
    >
      {loading || !syllabus ? (
        <div className="py-12 text-center text-sm text-gray-500">
          Loading detailed academic syllabus...
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header Metric Strip (Clean Unboxed Layout) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border-y border-gray-100 py-3 bg-gray-50/50 rounded-lg px-3">
            <div>
              <span className="text-gray-400 font-medium">Credits</span>
              <p className="font-semibold text-gray-900 mt-0.5">{syllabus.credits} Degree Credits</p>
            </div>
            <div>
              <span className="text-gray-400 font-medium">Lecture Hours</span>
              <p className="font-semibold text-gray-900 mt-0.5">{syllabus.totalLectureHours} Hours</p>
            </div>
            <div>
              <span className="text-gray-400 font-medium">Faculty Instructor</span>
              <p className="font-semibold text-gray-900 mt-0.5 truncate">{course.instructor}</p>
            </div>
            <div>
              <span className="text-gray-400 font-medium">Prerequisites</span>
              <p className="font-semibold text-gray-900 mt-0.5 truncate">{syllabus.prerequisites}</p>
            </div>
          </div>

          {/* Navigation Segments for Syllabus Sections */}
          <div className="flex items-center gap-1 border-b border-gray-200 pb-1 text-xs">
            <button
              onClick={() => setActiveTab('units')}
              className={`px-3 py-1.5 font-medium transition-colors border-b-2 ${
                activeTab === 'units'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Units Breakdown ({syllabus.units.length} Units)
            </button>
            <button
              onClick={() => setActiveTab('evaluation')}
              className={`px-3 py-1.5 font-medium transition-colors border-b-2 ${
                activeTab === 'evaluation'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Evaluation & Marking Scheme
            </button>
            <button
              onClick={() => setActiveTab('textbooks')}
              className={`px-3 py-1.5 font-medium transition-colors border-b-2 ${
                activeTab === 'textbooks'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Prescribed Textbooks
            </button>
            <button
              onClick={() => setActiveTab('practicals')}
              className={`px-3 py-1.5 font-medium transition-colors border-b-2 ${
                activeTab === 'practicals'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Lab Practicals
            </button>
          </div>

          {/* TAB 1: UNITS ACCORDION */}
          {activeTab === 'units' && (
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {syllabus.units.map((unit) => {
                const isOpen = activeUnitNumber === unit.unitNumber;
                return (
                  <div
                    key={unit.unitNumber}
                    className="border border-gray-200 rounded-lg overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveUnitNumber(isOpen ? null : unit.unitNumber)}
                      className="w-full text-left p-3 bg-white hover:bg-gray-50 flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-gray-900"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xs text-blue-600 font-mono font-bold shrink-0">
                          Unit {unit.unitNumber}
                        </span>
                        <span className="truncate">{unit.title}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-normal text-gray-500 shrink-0">
                        <span>{unit.hours} Hours</span>
                        <span>·</span>
                        <span className="font-semibold text-gray-700">{unit.weightagePercent}% Marks</span>
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="p-3.5 bg-gray-50/70 border-t border-gray-100 text-xs space-y-2.5">
                        <div>
                          <span className="font-semibold text-gray-700 block mb-1">
                            Syllabus Topics & Lectures:
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-gray-600 leading-relaxed pl-1">
                            {unit.topics.map((t, idx) => (
                              <li key={idx}>{t}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-2 border-t border-gray-200/60">
                          <span className="font-semibold text-gray-700">Course Outcome (CO): </span>
                          <span className="text-gray-600">{unit.learningOutcome}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: EVALUATION SCHEME */}
          {activeTab === 'evaluation' && (
            <div className="space-y-3 text-xs sm:text-sm">
              <p className="text-xs text-gray-600 leading-relaxed">
                Assessment format approved by the BVCOE Academic Board for degree credit certification:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 bg-white border border-gray-200 rounded-lg">
                  <span className="text-xs text-gray-500">In-Semester Exam (ISE / Mid-Sem)</span>
                  <div className="text-lg font-bold text-gray-900 mt-0.5">
                    {syllabus.evaluationScheme.inSemesterExam} Marks
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Written continuous evaluation covering Units 1, 2, and 3.
                  </p>
                </div>

                <div className="p-3 bg-white border border-gray-200 rounded-lg">
                  <span className="text-xs text-gray-500">End-Semester Exam (ESE)</span>
                  <div className="text-lg font-bold text-blue-600 mt-0.5">
                    {syllabus.evaluationScheme.endSemesterExam} Marks
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Comprehensive final university written examination spanning Units 1 through 6.
                  </p>
                </div>

                <div className="p-3 bg-white border border-gray-200 rounded-lg">
                  <span className="text-xs text-gray-500">Term Work / Assignments</span>
                  <div className="text-lg font-bold text-gray-900 mt-0.5">
                    {syllabus.evaluationScheme.termWork} Marks
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Continuous lab assignment reviews, attendance, and tutorial records.
                  </p>
                </div>

                <div className="p-3 bg-white border border-gray-200 rounded-lg">
                  <span className="text-xs text-gray-500">Practical & Oral Examination</span>
                  <div className="text-lg font-bold text-emerald-600 mt-0.5">
                    {syllabus.evaluationScheme.practicalOral} Marks
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Hands-on laboratory viva conducted by external faculty examiner.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEXTBOOKS */}
          {activeTab === 'textbooks' && (
            <div className="space-y-3 max-h-[360px] overflow-y-auto text-xs">
              <div>
                <span className="font-semibold text-gray-900 text-xs block mb-2">
                  Prescribed Primary Textbooks:
                </span>
                <div className="space-y-2">
                  {syllabus.textbooks.map((b, i) => (
                    <div
                      key={i}
                      className="p-3 bg-white border border-gray-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900">{b.title}</p>
                        <p className="text-gray-600 mt-0.5">Author(s): {b.author}</p>
                        <p className="text-gray-400 mt-0.5">
                          {b.publisher} · {b.edition}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setActivePdfBook({
                            title: b.title,
                            authorOrSource: b.author,
                            department: course.department,
                            subject: course.title,
                            fileSize: '4.8 MB',
                          })
                        }
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Open Book (PDF)</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {syllabus.referenceBooks && syllabus.referenceBooks.length > 0 && (
                <div className="pt-2">
                  <span className="font-semibold text-gray-900 text-xs block mb-2">
                    Official Reference Handbooks:
                  </span>
                  <div className="space-y-2">
                    {syllabus.referenceBooks.map((b, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <p className="font-medium text-gray-800">{b.title}</p>
                          <p className="text-gray-500 text-[11px]">
                            {b.author} · {b.publisher}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setActivePdfBook({
                              title: b.title,
                              authorOrSource: b.author,
                              department: course.department,
                              subject: course.title,
                              fileSize: '3.2 MB',
                            })
                          }
                          className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded text-xs font-medium shrink-0 flex items-center gap-1 self-start sm:self-auto"
                        >
                          <FileText className="w-3 h-3 text-blue-600" />
                          <span>Open PDF</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PRACTICALS */}
          {activeTab === 'practicals' && (
            <div className="space-y-2 max-h-[360px] overflow-y-auto text-xs">
              <span className="font-semibold text-gray-900 text-xs block mb-1">
                Semester Laboratory Experiments & Code Assignments:
              </span>
              <div className="space-y-1.5">
                {syllabus.practicalExercises.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-white border border-gray-200 rounded-lg flex items-start gap-2.5"
                  >
                    <span className="font-mono text-blue-600 font-bold shrink-0">
                      Exp {idx + 1}.
                    </span>
                    <span className="text-gray-700 leading-relaxed">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadSyllabus}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Syllabus Outline</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/tests');
                }}
                className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
              >
                View Linked Tests ({course.associatedTestsCount})
              </button>
            </div>

            <div className="flex items-center gap-2">
              {onEnroll && (
                <button
                  type="button"
                  onClick={() => onEnroll(course)}
                  className={`px-4 py-1.5 rounded-lg font-semibold transition-colors shadow-2xs ${
                    isEnrolled
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isEnrolled ? 'Registered' : 'Enroll in Course'}
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-gray-600 hover:text-gray-900 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>

    {/* PDF Reader Modal for Prescribed Textbooks */}
    <PdfViewerModal
      document={activePdfBook}
      isOpen={!!activePdfBook}
      onClose={() => setActivePdfBook(null)}
    />
    </>
  );
};
