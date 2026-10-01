import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { testService } from '../services/testService';
import { testSeriesService, AcademicTestSeries } from '../services/testSeriesService';
import { PracticeTest, TestFreeResource } from '../types';
import {
  BookOpen,
  Clock,
  CheckCircle,
  ArrowRight,
  Award,
  ArrowDownToLine,
  FileText,
  Sparkles,
  Download,
  Filter,
  Search,
  ExternalLink,
  Calendar,
  Layers,
  Users,
  Check,
  X,
} from 'lucide-react';
import { CardSkeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import { DEFAULT_CAMPUS } from '../constants/app';
import { courseService, Course } from '../services/courseService';
import { TestSeriesModal } from '../components/domain/TestSeriesModal';
import { EmptyState } from '../components/ui/EmptyState';
import { PdfViewerModal, PdfDocument } from '../components/common/PdfViewerModal';

export const TestsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showInfo } = useToast();

  const [activeTab, setActiveTab] = useState<'series' | 'single_tests'>('series');
  const [testSeriesList, setTestSeriesList] = useState<AcademicTestSeries[]>([]);
  const [tests, setTests] = useState<PracticeTest[]>([]);
  const [selectedPdfDoc, setSelectedPdfDoc] = useState<PdfDocument | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Sorting
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [filterCourse, setFilterCourse] = useState<string>('All');
  const [filterDept, setFilterDept] = useState<string>('All Departments');
  const [higherOnly, setHigherOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'title' | 'enrolled' | 'tests' | 'difficulty'>('default');

  // Modals
  const [selectedSeries, setSelectedSeries] = useState<AcademicTestSeries | null>(null);
  const [isSeriesModalOpen, setIsSeriesModalOpen] = useState(false);
  const [activeFreeResource, setActiveFreeResource] = useState<TestFreeResource | null>(null);

  useEffect(() => {
    courseService.getCourses().then((cList) => setCourses(cList));
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        const [loadedSeries, loadedTests] = await Promise.all([
          testSeriesService.getAllSeries({
            department: filterDept,
            courseId: filterCourse,
            query: searchQuery,
            sortBy: sortBy === 'enrolled' ? 'enrolled' : sortBy === 'title' ? 'title' : sortBy === 'tests' ? 'tests' : 'date',
          }),
          testService.getTests({
            difficulty: filterDifficulty,
            courseId: filterCourse,
            higherOnly,
            query: searchQuery,
          }),
        ]);
        if (mounted) {
          setTestSeriesList(loadedSeries);
          setTests(loadedTests);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    loadAllData();
    return () => {
      mounted = false;
    };
  }, [filterDifficulty, filterCourse, filterDept, higherOnly, searchQuery, sortBy]);

  const handleToggleSeriesEnroll = async (seriesId: string) => {
    const isNowEnrolled = await testSeriesService.toggleEnrollSeries(seriesId);
    setTestSeriesList((prev) =>
      prev.map((s) =>
        s.id === seriesId
          ? {
              ...s,
              isRegistered: isNowEnrolled,
              enrolledStudentsCount: isNowEnrolled
                ? s.enrolledStudentsCount + 1
                : Math.max(0, s.enrolledStudentsCount - 1),
            }
          : s
      )
    );
    if (selectedSeries?.id === seriesId) {
      setSelectedSeries((prev) => (prev ? { ...prev, isRegistered: isNowEnrolled } : null));
    }
    if (isNowEnrolled) {
      showSuccess('Enrolled in Academic Test Series. Examination slots reserved.', 'Enrolled');
    } else {
      showInfo('Unregistered from Test Series.');
    }
  };

  const openSeriesDetail = (series: AcademicTestSeries) => {
    setSelectedSeries(series);
    setIsSeriesModalOpen(true);
  };

  // Sort tests if single_tests view is active
  const sortedTests = [...tests].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'difficulty') {
      const rank = { 'Higher / Mastery': 4, Advanced: 3, Intermediate: 2, Beginner: 1 };
      return (rank[b.difficulty] || 0) - (rank[a.difficulty] || 0);
    }
    return 0;
  });

  const totalFreeResourcesCount = tests.reduce(
    (acc, t) => acc + (t.freelyAvailableResources?.length || 0),
    0
  );

  return (
    <div className="space-y-5 pb-14">
      {/* Page Header */}
      <PageHeader
        title="Academic Test Series & Examination Hub"
        description={`Diagnostic chapter assessments, semester test series tracks, and freely available study materials for ${DEFAULT_CAMPUS.name}.`}
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/courses')}
              className="px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-2xs transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Course Curriculum</span>
            </button>
          </div>
        }
      />

      {/* 4 Equal-Weight Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider">
            Test Series Tracks
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-900 font-mono tabular-nums">
              {testSeriesList.length}
            </span>
            <span className="text-xs text-purple-800">Proctored Tracks</span>
          </div>
          <span className="text-[11px] text-gray-400 mt-1">Multi-Paper Scheduled Series</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
            Chapter Assessments
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-700 font-mono tabular-nums">
              {tests.length}
            </span>
            <span className="text-xs text-blue-800">Topic Quizzes</span>
          </div>
          <span className="text-[11px] text-gray-400 mt-1">Standard & Higher Level</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
            Free Study Materials
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
              {totalFreeResourcesCount}
            </span>
            <span className="text-xs text-emerald-800">Notes & Cheat Sheets</span>
          </div>
          <span className="text-[11px] text-gray-400 mt-1">Zero-Cost Offline Docs</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Campus Percentile
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 font-mono tabular-nums">
              92.4%
            </span>
            <span className="text-xs text-gray-500">Cohort Average</span>
          </div>
          <span className="text-[11px] text-gray-400 mt-1">Based on Verified Attempts</span>
        </div>
      </div>

      {/* Control Bar: Tabs & Search/Sort */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          {/* Segmented View Control */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('series')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'series'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Academic Test Series Tracks ({testSeriesList.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('single_tests')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'single_tests'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Chapter Assessments ({tests.length})</span>
            </button>
          </div>

          {/* Quick Active Filter Indicator */}
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span>
              Showing {activeTab === 'series' ? testSeriesList.length : sortedTests.length} items
            </span>
            {(filterCourse !== 'All' || filterDept !== 'All Departments' || filterDifficulty !== 'All' || higherOnly || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setFilterCourse('All');
                  setFilterDept('All Departments');
                  setFilterDifficulty('All');
                  setHigherOnly(false);
                  setSearchQuery('');
                  setSortBy('default');
                }}
                className="text-blue-600 hover:underline font-semibold flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search test series, subjects, topics, or course codes..."
              className="w-full h-9 pl-9 pr-3 bg-white text-gray-900 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder:text-gray-400"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="w-full h-9 px-2.5 bg-white text-gray-700 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="All">All Courses ({courses.length})</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}: {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="w-full h-9 px-2.5 bg-white text-gray-700 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="All Departments">All Departments</option>
              {DEFAULT_CAMPUS.departmentList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full h-9 px-2.5 bg-white text-gray-700 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="default">Sort: Recommended</option>
              <option value="title">Sort: Title (A-Z)</option>
              <option value="enrolled">Sort: Most Enrolled</option>
              <option value="tests">Sort: Total Papers</option>
              <option value="difficulty">Sort: Difficulty</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1 text-xs">
          <button
            type="button"
            onClick={() => setHigherOnly(!higherOnly)}
            className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
              higherOnly
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Higher / Mastery Examinations Only</span>
          </button>

          <span className="text-gray-300">|</span>

          {['All', 'Beginner', 'Intermediate', 'Advanced', 'Higher / Mastery'].map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => setFilterDifficulty(diff)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterDifficulty === diff
                  ? 'bg-gray-900 text-white font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT TAB 1: ACADEMIC TEST SERIES TRACKS */}
      {activeTab === 'series' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : testSeriesList.length === 0 ? (
            <div className="col-span-2">
              <EmptyState
                title="No test series match your filters"
                description="Try clearing your search query or selecting All Departments."
                actionLabel="Reset Filters"
                onAction={() => {
                  setFilterCourse('All');
                  setFilterDept('All Departments');
                  setSearchQuery('');
                  setSortBy('default');
                }}
              />
            </div>
          ) : (
            testSeriesList.map((series) => (
              <div
                key={series.id}
                className={`bg-white rounded-xl border p-5 shadow-2xs hover:border-gray-300 transition-all flex flex-col justify-between ${
                  series.isRegistered ? 'border-purple-300 ring-1 ring-purple-100' : 'border-gray-200'
                }`}
              >
                {/* Upper Content */}
                <div className="space-y-2.5">
                  {/* Clean unboxed metadata kicker */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="font-bold text-gray-900">{series.seriesCode}</span>
                      <span>·</span>
                      <span>{series.courseCode}</span>
                      <span>·</span>
                      <span>{series.semester}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-purple-700 font-semibold">{series.difficulty}</span>
                      {series.isRegistered && (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Registered</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h3
                      onClick={() => openSeriesDetail(series)}
                      className="text-base font-semibold text-gray-900 leading-snug hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {series.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {series.department} · Coordinated by {series.coordinator}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {series.description}
                  </p>

                  {/* Scheduled Exams List Preview */}
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-700">
                        Included Exam Papers ({series.exams.length} Papers · {series.totalMarks} Total Marks):
                      </span>
                      <span className="text-[11px] text-gray-400">Target: {series.targetExamDate}</span>
                    </div>
                    <div className="space-y-1">
                      {series.exams.slice(0, 2).map((exam, idx) => (
                        <div key={idx} className="flex items-center justify-between text-gray-600 text-[11px]">
                          <span className="truncate pr-2">• {exam.title}</span>
                          <span className="shrink-0 text-gray-400 font-mono">{exam.durationMinutes}m / {exam.totalMarks}M</span>
                        </div>
                      ))}
                      {series.exams.length > 2 && (
                        <p className="text-[11px] text-blue-600 font-medium">
                          +{series.exams.length - 2} more proctored papers in series
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Row (Balanced & Aligned) */}
                <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-gray-500 font-mono text-[11px]">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    <span>{series.enrolledStudentsCount} Candidates</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openSeriesDetail(series)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Layers className="w-3.5 h-3.5 text-blue-600" />
                      <span>View Series Papers</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleSeriesEnroll(series.id)}
                      className={`px-3.5 py-1.5 rounded-lg font-semibold text-xs transition-colors shadow-2xs ${
                        series.isRegistered
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      {series.isRegistered ? 'Enrolled' : 'Register Track'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* CONTENT TAB 2: INDIVIDUAL CHAPTER TESTS */}
      {activeTab === 'single_tests' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : sortedTests.length === 0 ? (
            <div className="col-span-2">
              <EmptyState
                title="No tests match your criteria"
                description="Try clearing the Higher Tests filter or selecting All Courses."
                actionLabel="Reset Filters"
                onAction={() => {
                  setHigherOnly(false);
                  setFilterDifficulty('All');
                  setFilterCourse('All');
                  setSearchQuery('');
                  setSortBy('default');
                }}
              />
            </div>
          ) : (
            sortedTests.map((test) => (
              <div
                key={test.id}
                className={`bg-white rounded-xl border p-5 shadow-2xs hover:border-gray-300 transition-all flex flex-col justify-between ${
                  test.isHigherTest ? 'border-purple-200 ring-1 ring-purple-100/50' : 'border-gray-200'
                }`}
              >
                {/* Upper Content */}
                <div className="space-y-2.5">
                  {/* Clean unboxed metadata kicker */}
                  <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900">{test.subject}</span>
                      <span>·</span>
                      <span>{test.semester}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={test.isHigherTest ? 'text-purple-700 font-semibold' : 'text-gray-700'}>
                        {test.difficulty}
                      </span>
                      {test.isAvailableOffline && (
                        <span className="text-emerald-700 font-medium">Offline Ready</span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 leading-snug">
                      {test.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{test.department}</p>
                  </div>

                  {/* Freely Available Study Materials Strip */}
                  {test.freelyAvailableResources && test.freelyAvailableResources.length > 0 && (
                    <div className="p-3 bg-blue-50/40 rounded-lg border border-blue-100/70 text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-semibold text-gray-800">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Freely Available Resources ({test.freelyAvailableResources.length}):</span>
                        </div>
                        <span className="text-[11px] text-blue-700 font-medium">Zero-Cost Campus Doc</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {test.freelyAvailableResources.map((res) => (
                          <button
                            key={res.id}
                            type="button"
                            onClick={() => setActiveFreeResource(res)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 text-xs font-medium transition-all shadow-2xs group"
                            title={res.description}
                          >
                            <span className="font-semibold">{res.title}</span>
                            <span className="text-[10px] px-1 py-0.2 rounded bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-800">
                              {res.type}
                            </span>
                            <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-600" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Test Stats & Actions */}
                <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-gray-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{test.durationMinutes} mins</span>
                    </span>
                    <span>·</span>
                    <span>{test.questionsCount} questions</span>
                    {test.highScorePercentage && (
                      <>
                        <span>·</span>
                        <span className="text-amber-700 font-semibold">
                          Top: {test.highScorePercentage}%
                        </span>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/tests/${test.id}`)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors shadow-2xs flex items-center gap-1.5 ${
                      test.isHigherTest
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <span>{test.isHigherTest ? 'Start Higher Test' : 'Start Test'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Test Series Detail Modal */}
      <TestSeriesModal
        series={selectedSeries}
        isOpen={isSeriesModalOpen}
        onClose={() => {
          setIsSeriesModalOpen(false);
          setSelectedSeries(null);
        }}
        onToggleEnroll={handleToggleSeriesEnroll}
      />

      {/* Free Resource Preview Modal */}
      <Modal
        isOpen={!!activeFreeResource}
        onClose={() => setActiveFreeResource(null)}
        title={activeFreeResource?.title || ''}
        description={activeFreeResource ? `${activeFreeResource.type} · ${activeFreeResource.authorOrSource}` : ''}
      >
        {activeFreeResource && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-3.5 bg-blue-50/70 border border-blue-200/60 rounded-xl space-y-1 text-blue-950">
              <span className="font-semibold text-xs text-blue-800 uppercase tracking-wider block">
                Free Academic Material Scope
              </span>
              <p className="text-xs text-gray-700 leading-relaxed">
                {activeFreeResource.description}
              </p>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center space-y-2">
              <FileText className="w-8 h-8 text-blue-600 mx-auto" />
              <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                Document Cached & Ready for Offline Preparation
              </p>
              <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
                Provided freely to all enrolled students at {DEFAULT_CAMPUS.name}. Can be saved locally to review before answering test questions.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveFreeResource(null)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showSuccess(`Downloaded "${activeFreeResource.title}" to local courseware.`);
                  setActiveFreeResource(null);
                }}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold shadow-2xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Offline</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const res = activeFreeResource;
                  setActiveFreeResource(null);
                  setSelectedPdfDoc({
                    title: res.title,
                    subject: res.title,
                    department: DEFAULT_CAMPUS.name,
                    fileSize: '1.9 MB',
                  });
                }}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors"
                title="Open and read document in Academic PDF Reader"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Open PDF</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Academic PDF Reader Modal */}
      <PdfViewerModal
        document={selectedPdfDoc}
        isOpen={!!selectedPdfDoc}
        onClose={() => setSelectedPdfDoc(null)}
      />
    </div>
  );
};
