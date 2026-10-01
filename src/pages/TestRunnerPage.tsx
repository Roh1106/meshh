import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { testService } from '../services/testService';
import { testsRepository } from '../repositories';
import { PracticeTest, TestFreeResource, TestAttempt, TestViolation } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Award,
  FileText,
  ChevronDown,
  ChevronUp,
  Download,
  ShieldAlert,
  Maximize2,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';
import { AssessmentIntegrityMonitor } from '../services/assessmentIntegrityService';

export const TestRunnerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showWarning, showError } = useToast();

  const [test, setTest] = useState<PracticeTest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [attemptId, setAttemptId] = useState<string>('');
  const [answeredMap, setAnsweredMap] = useState<Record<string, number>>({});

  // Free resources drawer / preview
  const [showFreeResources, setShowFreeResources] = useState(false);
  const [previewResource, setPreviewResource] = useState<TestFreeResource | null>(null);

  // Integrity Monitoring State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violations, setViolations] = useState<TestViolation[]>([]);
  const [activeViolationModal, setActiveViolationModal] = useState<{
    violation: TestViolation;
    count: number;
    action: 'warn' | 'final_warning' | 'auto_submit';
  } | null>(null);

  const monitorRef = useRef<AssessmentIntegrityMonitor | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const item = await testService.getTestById(id);
        if (mounted && item) {
          setTest(item);

          // Check if there is an active saved attempt in IndexedDB repository
          const existingAttempt = await testsRepository.getActiveAttempt(item.id);
          if (existingAttempt) {
            setAttemptId(existingAttempt.id);
            setAnsweredMap(existingAttempt.answers);
            setViolations(existingAttempt.violations || []);
            const answeredCount = Object.keys(existingAttempt.answers).length;
            if (answeredCount > 0 && answeredCount < item.questions!.length) {
              setCurrentIndex(answeredCount);
            }
          } else {
            const newAttemptId = `att_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
            setAttemptId(newAttemptId);
            const initialAttempt: TestAttempt = {
              id: newAttemptId,
              testId: item.id,
              studentId: 'current_user',
              startedAt: new Date().toISOString(),
              answers: {},
              violations: [],
              isSubmitted: false,
              integrityStatus: 'Clean',
            };
            await testsRepository.saveAttempt(initialAttempt);
          }
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Start Assessment Integrity Monitor
  useEffect(() => {
    if (!attemptId || isFinished) return;

    const monitor = new AssessmentIntegrityMonitor(attemptId, violations.length);
    monitorRef.current = monitor;

    const unsubscribe = monitor.subscribe({
      onViolation: (violation, totalViolations, action) => {
        setViolations((prev) => [...prev, violation]);
        setActiveViolationModal({ violation, count: totalViolations, action });

        if (action === 'auto_submit') {
          showError('Assessment automatically submitted due to maximum focus violations.');
          setIsFinished(true);
        } else if (action === 'final_warning') {
          showWarning('Final warning: Another focus change will submit this assessment.');
        } else {
          showWarning('Browser focus changed. Please remain inside the assessment window.');
        }
      },
      onFullscreenChange: (fs) => setIsFullscreen(fs),
    });

    monitor.start();

    return () => {
      unsubscribe();
      monitor.stop();
    };
  }, [attemptId, isFinished]);

  if (isLoading) return <Spinner size="lg" className="py-20" />;

  if (!test || !test.questions || test.questions.length === 0) {
    return (
      <div className="py-10">
        <ErrorState
          title="Test Content Unavailable"
          message="This quiz has no active questions loaded for offline mode."
          onRetry={() => navigate('/tests')}
        />
      </div>
    );
  }

  const currentQ = test.questions[currentIndex];

  const handleSelectOption = async (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);

    const newMap = { ...answeredMap, [currentQ.id]: idx };
    setAnsweredMap(newMap);

    const isCorrect = idx === currentQ.correctIndex;
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) {
      setScore(newScore);
    }

    // Autosave attempt locally into IndexedDB repository
    if (attemptId) {
      const attempt: TestAttempt = {
        id: attemptId,
        testId: test.id,
        studentId: 'current_user',
        startedAt: new Date().toISOString(),
        answers: newMap,
        score: newScore,
        maxScore: test.questions!.length,
        percentage: Math.round((newScore / test.questions!.length) * 100),
        violations,
        isSubmitted: false,
        integrityStatus: violations.length > 0 ? 'Warning issued' : 'Clean',
      };
      await testsRepository.saveAttempt(attempt);
    }
  };

  const handleNextQuestion = async () => {
    if (currentIndex + 1 < test.questions!.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
      // Mark as submitted in local repository
      if (attemptId) {
        const attempt: TestAttempt = {
          id: attemptId,
          testId: test.id,
          studentId: 'current_user',
          startedAt: new Date().toISOString(),
          submittedAt: new Date().toISOString(),
          answers: answeredMap,
          score,
          maxScore: test.questions!.length,
          percentage: Math.round((score / test.questions!.length) * 100),
          violations,
          isSubmitted: true,
          integrityStatus: violations.length > 0 ? 'Review required' : 'Clean',
        };
        await testsRepository.saveAttempt(attempt);
      }
      showSuccess(`Test completed! Your score: ${score} / ${test.questions!.length}`);
    }
  };

  const handleRequestFullscreen = async () => {
    if (monitorRef.current) {
      await monitorRef.current.requestFullscreen();
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setIsFinished(false);
    setViolations([]);
  };

  if (isFinished) {
    const percentage = Math.round((score / test.questions.length) * 100);
    return (
      <div className="max-w-md mx-auto py-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Quiz Completed!</h2>
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-xs space-y-2">
          <p className="text-3xl font-extrabold text-blue-600">{percentage}%</p>
          <p className="text-xs text-gray-500">
            You answered {score} out of {test.questions.length} questions correctly.
          </p>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">Integrity Log:</span>
            <span className={`font-semibold ${violations.length === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
              {violations.length === 0 ? 'Clean (0 focus shifts)' : `${violations.length} focus events recorded`}
            </span>
          </div>

          {test.isHigherTest && (
            <span className="inline-block mt-2 px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-xs font-bold">
              Higher / Mastery Level Exam Verified
            </span>
          )}
        </div>
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Quiz</span>
          </button>
          <button
            onClick={() => navigate('/tests')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
          >
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-12 max-w-2xl mx-auto">
      <PageHeader
        title={test.title}
        description={`Question ${currentIndex + 1} of ${test.questions.length} · ${test.difficulty}`}
        backTo="/tests"
      />

      {/* ASSESSMENT INTEGRITY MONITORING BANNER */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-gray-700">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Browser-Level Assessment Monitoring:</strong> Window visibility and fullscreen states are logged for faculty review.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isFullscreen && (
            <button
              type="button"
              onClick={handleRequestFullscreen}
              className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded text-xs font-medium text-gray-700 flex items-center gap-1 transition-colors"
              title="Enter full-screen mode to prevent distraction"
            >
              <Maximize2 className="w-3 h-3 text-blue-600" />
              <span>Fullscreen</span>
            </button>
          )}

          <span
            className={`px-2 py-0.5 rounded font-mono font-semibold text-[11px] ${
              violations.length === 0
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {violations.length === 0 ? 'Focus Clean' : `${violations.length} Event${violations.length > 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* FREELY AVAILABLE RESOURCES ATTACHMENT ACCORDION */}
      {test.freelyAvailableResources && test.freelyAvailableResources.length > 0 && (
        <div className="bg-blue-50/70 border border-blue-200/70 rounded-xl overflow-hidden text-xs">
          <button
            onClick={() => setShowFreeResources(!showFreeResources)}
            className="w-full p-3 flex items-center justify-between font-semibold text-blue-900 hover:bg-blue-100/50 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>
                Free Reference Materials & Cheat Sheets Attached ({test.freelyAvailableResources.length})
              </span>
            </span>
            {showFreeResources ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showFreeResources && (
            <div className="p-3 pt-0 space-y-2 border-t border-blue-200/50 mt-1">
              <p className="text-[11px] text-blue-800">
                You can review these freely available campus notes or formula sheets while attempting this diagnostic test:
              </p>
              <div className="space-y-1.5">
                {test.freelyAvailableResources.map((res) => (
                  <div
                    key={res.id}
                    onClick={() => setPreviewResource(res)}
                    className="p-2 bg-white rounded-lg border border-blue-200 flex items-center justify-between hover:border-blue-400 cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-gray-900 text-xs block">{res.title}</span>
                      <span className="text-[10px] text-gray-500">
                        {res.type} · {res.authorOrSource}
                      </span>
                    </div>
                    <span className="text-blue-600 text-[11px] font-semibold">Open Note</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Question Card */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-xs space-y-4">
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / test.questions.length) * 100}%` }}
          />
        </div>

        <p className="text-sm sm:text-base font-semibold text-gray-900 leading-snug">
          {currentIndex + 1}. {currentQ.prompt}
        </p>

        <div className="space-y-2 pt-2">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;

            let btnClass = 'border-gray-200 bg-white hover:bg-gray-50 text-gray-800';
            if (showExplanation) {
              if (isCorrect) {
                btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
              } else if (isSelected) {
                btnClass = 'border-red-400 bg-red-50 text-red-900';
              } else {
                btnClass = 'border-gray-200 bg-gray-50 opacity-60 text-gray-600';
              }
            }

            return (
              <button
                key={idx}
                disabled={showExplanation}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all flex items-center justify-between ${btnClass}`}
              >
                <span>{opt}</span>
                {showExplanation && (
                  <span>
                    {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    {isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-950 space-y-1 animate-in fade-in">
            <span className="font-bold block">Academic Solution & Explanation:</span>
            <p className="leading-relaxed">{currentQ.explanation}</p>
          </div>
        )}

        {showExplanation && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>{currentIndex + 1 < test.questions.length ? 'Next Question' : 'Finish Quiz'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Free Resource Reader Modal */}
      <Modal
        isOpen={!!previewResource}
        onClose={() => setPreviewResource(null)}
        title={previewResource?.title || ''}
        description={previewResource ? `${previewResource.type} · ${previewResource.authorOrSource}` : ''}
      >
        {previewResource && (
          <div className="space-y-4 text-xs sm:text-sm">
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-200">
              {previewResource.description}
            </p>
            <div className="text-center py-6 border border-dashed border-gray-300 rounded-lg space-y-2">
              <FileText className="w-8 h-8 text-blue-600 mx-auto" />
              <p className="font-semibold text-gray-900">Open Courseware Reference Document</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Cached locally for offline study in Bharti Vidyapeeth College of Engineering campus network.
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewResource(null)}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold"
              >
                Done Reading
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
