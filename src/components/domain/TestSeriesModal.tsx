import React from 'react';
import { Modal } from '../common/Modal';
import { AcademicTestSeries, TestSeriesExam } from '../../services/testSeriesService';
import {
  Award,
  CheckCircle,
  Clock,
  BookOpen,
  ArrowRight,
  Calendar,
  Layers,
  Users,
  Check,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

interface TestSeriesModalProps {
  series: AcademicTestSeries | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleEnroll: (seriesId: string) => void;
}

export const TestSeriesModal: React.FC<TestSeriesModalProps> = ({
  series,
  isOpen,
  onClose,
  onToggleEnroll,
}) => {
  const navigate = useNavigate();
  const { showSuccess } = useToast();

  if (!series) return null;

  const handleStartExam = (exam: TestSeriesExam) => {
    onClose();
    if (exam.testId) {
      navigate(`/tests/${exam.testId}`);
    } else {
      showSuccess(`Exam session initialized for ${exam.title}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${series.seriesCode} · ${series.title}`}
      description={`${series.department} · ${series.semester} · Coordinated by ${series.coordinator}`}
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Metric summary strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border-y border-gray-100 py-3 bg-gray-50/50 rounded-lg px-3">
          <div>
            <span className="text-gray-400 font-medium">Difficulty Track</span>
            <p className="font-semibold text-gray-900 mt-0.5">{series.difficulty}</p>
          </div>
          <div>
            <span className="text-gray-400 font-medium">Cohort Enrolled</span>
            <p className="font-semibold text-gray-900 mt-0.5">{series.enrolledStudentsCount} Candidates</p>
          </div>
          <div>
            <span className="text-gray-400 font-medium">Total Test Papers</span>
            <p className="font-semibold text-gray-900 mt-0.5">{series.totalTests} Examination Mocks</p>
          </div>
          <div>
            <span className="text-gray-400 font-medium">Target Exam Date</span>
            <p className="font-semibold text-gray-900 mt-0.5">{series.targetExamDate}</p>
          </div>
        </div>

        {/* Description & Benefits */}
        <div className="text-xs text-gray-600 leading-relaxed space-y-2">
          <p>{series.description}</p>
          <div className="p-3 bg-blue-50/40 border border-blue-100 rounded-lg">
            <span className="font-semibold text-blue-900 block mb-1.5">
              Series Benefits & Proctoring Invariants:
            </span>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              {series.benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Scheduled Examination Papers */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Examination Schedule & Papers ({series.exams.length})
            </h4>
            <span className="text-[11px] text-gray-500">
              Total Series Marks: {series.totalMarks}
            </span>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {series.exams.map((exam, index) => (
              <div
                key={exam.id}
                className="p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-600">
                      Paper {index + 1}.
                    </span>
                    <span className="font-semibold text-gray-900">{exam.title}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-1">
                    Coverage: {exam.syllabusCoverage}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400">
                    <span>{exam.durationMinutes} mins</span>
                    <span>·</span>
                    <span>{exam.questionsCount} questions</span>
                    <span>·</span>
                    <span>{exam.totalMarks} Marks (Pass: {exam.passingMarks})</span>
                    {exam.userScore !== undefined && (
                      <>
                        <span>·</span>
                        <span className="text-emerald-700 font-semibold">
                          Score: {exam.userScore}/{exam.totalMarks} (Rank #{exam.rank})
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartExam(exam)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span>{exam.status === 'Completed' ? 'Retake Exam' : 'Take Paper'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => onToggleEnroll(series.id)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all shadow-2xs flex items-center gap-1.5 ${
              series.isRegistered
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {series.isRegistered ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Enrolled in Series</span>
              </>
            ) : (
              <span>Register for this Test Series</span>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-gray-600 hover:text-gray-900 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
