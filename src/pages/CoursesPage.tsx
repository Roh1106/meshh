import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { courseService, Course } from '../services/courseService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  GraduationCap,
  BookOpen,
  CheckCircle,
  Plus,
  Users,
  Search,
  Check,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  FileText,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { CardSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { DEFAULT_CAMPUS } from '../constants/app';
import { CourseSyllabusModal } from '../components/domain/CourseSyllabusModal';

export const CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isEnrolledInCourse, enrollInCourse, unenrollFromCourse } = useAuth();
  const { showSuccess, showInfo } = useToast();

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedSemester, setSelectedSemester] = useState('All Semesters');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'code' | 'title' | 'credits' | 'seats' | 'enrolled'>('code');
  const [viewTab, setViewTab] = useState<'all' | 'my_courses'>('all');

  // Course Syllabus Modal State
  const [syllabusCourse, setSyllabusCourse] = useState<Course | null>(null);
  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false);
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadCourses = async () => {
      setIsLoading(true);
      try {
        const data = await courseService.getCourses({
          department: selectedDept,
          query: searchQuery,
        });
        if (mounted) setCourses(data);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    loadCourses();
    return () => {
      mounted = false;
    };
  }, [selectedDept, searchQuery]);

  const handleRegister = async (course: Course) => {
    setRegisteringId(course.id);
    try {
      await enrollInCourse(course.id);
      await courseService.registerStudentForCourse(
        {
          id: currentUser.id,
          name: currentUser.name,
          rollNo: currentUser.rollNo,
          department: currentUser.department,
        },
        course
      );
      showSuccess(
        `Registered for ${course.code}: ${course.title} at ${DEFAULT_CAMPUS.shortName}.`,
        'Course Registered'
      );
    } finally {
      setRegisteringId(null);
    }
  };

  const handleUnenroll = async (course: Course) => {
    await unenrollFromCourse(course.id);
    showInfo(`Unenrolled from ${course.code}: ${course.title}.`);
  };

  const openSyllabus = (course: Course) => {
    setSyllabusCourse(course);
    setIsSyllabusModalOpen(true);
  };

  const enrolledCoursesList = courses.filter((c) => isEnrolledInCourse(c.id));
  const totalEnrolledCredits = enrolledCoursesList.reduce((acc, c) => acc + c.credits, 0);

  // Filter by semester
  let filtered =
    viewTab === 'my_courses'
      ? enrolledCoursesList
      : courses;

  if (selectedSemester !== 'All Semesters') {
    filtered = filtered.filter((c) => c.semester === selectedSemester);
  }

  // Sort
  const sortedCourses = [...filtered].sort((a, b) => {
    if (sortBy === 'code') return a.code.localeCompare(b.code);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'credits') return b.credits - a.credits;
    if (sortBy === 'seats') {
      const seatsA = a.availableSeats - a.enrolledStudentsCount;
      const seatsB = b.availableSeats - b.enrolledStudentsCount;
      return seatsB - seatsA;
    }
    if (sortBy === 'enrolled') return b.enrolledStudentsCount - a.enrolledStudentsCount;
    return 0;
  });

  const semestersList = [
    'All Semesters',
    'Semester 3',
    'Semester 4',
    'Semester 5',
    'Semester 6',
    'Semester 7',
    'Semester 8',
  ];

  return (
    <div className="space-y-5 pb-14">
      {/* Header with Title and Action */}
      <PageHeader
        title="Course Curriculum & Syllabus Portal"
        description={`Academic course registrations, syllabus units, and degree credit verification for ${DEFAULT_CAMPUS.name}.`}
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/tests')}
              className="px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-2xs transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>Academic Test Series ({courses.length})</span>
            </button>
          </div>
        }
      />

      {/* 4 Equal-Weight Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Total Catalog Courses
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 font-mono tabular-nums">
              {courses.length}
            </span>
            <span className="text-xs text-gray-500">Curriculum Subjects</span>
          </div>
          <span className="text-[11px] text-gray-400 mt-1">Across 4 Engineering Depts</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
            My Enrolled Subjects
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
              {enrolledCoursesList.length}
            </span>
            <span className="text-xs text-emerald-800">Active Registrations</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1">
            Status: Officially Registered
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
            Registered Credits
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-700 font-mono tabular-nums">
              {totalEnrolledCredits}
            </span>
            <span className="text-xs text-blue-800">Degree Credits</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1">
            Min required: 20 per semester
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Campus Node
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900 truncate">
              {DEFAULT_CAMPUS.shortName}
            </span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 truncate">
            {currentUser.name} ({currentUser.rollNo || 'Faculty Admin'})
          </span>
        </div>
      </div>

      {/* Control Bar: View Tabs & Sorting / Filtering Controls */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          {/* Segmented Tab */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setViewTab('all')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                viewTab === 'all'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Courses ({courses.length})
            </button>
            <button
              type="button"
              onClick={() => setViewTab('my_courses')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                viewTab === 'my_courses'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>My Registrations</span>
              <span className="font-mono text-[11px] bg-blue-100 text-blue-800 px-1.5 rounded">
                {enrolledCoursesList.length}
              </span>
            </button>
          </div>

          {/* Quick Stats Indicator */}
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span>Showing {sortedCourses.length} of {courses.length} courses</span>
            {(selectedDept !== 'All Departments' || selectedSemester !== 'All Semesters' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedDept('All Departments');
                  setSelectedSemester('All Semesters');
                  setSearchQuery('');
                  setSortBy('code');
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
              placeholder="Search course title, syllabus topic, or course code..."
              className="w-full h-9 pl-9 pr-3 bg-white text-gray-900 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder:text-gray-400"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
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
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full h-9 px-2.5 bg-white text-gray-700 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              {semestersList.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
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
              <option value="code">Sort: Code (A-Z)</option>
              <option value="title">Sort: Title (A-Z)</option>
              <option value="credits">Sort: Credits (High)</option>
              <option value="seats">Sort: Available Seats</option>
              <option value="enrolled">Sort: Most Enrolled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course Cards Grid (Balanced 2-Column Desktop Grid with Equal Heights) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : sortedCourses.length === 0 ? (
          <div className="col-span-2">
            <EmptyState
              title={
                viewTab === 'my_courses'
                  ? 'No course registrations found'
                  : 'No matching courses found'
              }
              description={
                viewTab === 'my_courses'
                  ? 'You have not registered for any courses matching the selected filters. Switch to All Courses to register.'
                  : 'Try adjusting your search terms, semester selection, or department filters.'
              }
              actionLabel={viewTab === 'my_courses' ? 'Browse All Courses' : 'Clear Filters'}
              onAction={() => {
                if (viewTab === 'my_courses') setViewTab('all');
                else {
                  setSearchQuery('');
                  setSelectedDept('All Departments');
                  setSelectedSemester('All Semesters');
                }
              }}
            />
          </div>
        ) : (
          sortedCourses.map((course) => {
            const isEnrolled = isEnrolledInCourse(course.id);
            const isRegistering = registeringId === course.id;
            const openSeats = Math.max(0, course.availableSeats - course.enrolledStudentsCount);

            return (
              <div
                key={course.id}
                className={`bg-white rounded-xl border p-5 shadow-2xs hover:border-gray-300 transition-all flex flex-col justify-between ${
                  isEnrolled ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-gray-200'
                }`}
              >
                {/* Upper Details */}
                <div className="space-y-2.5">
                  {/* Clean unboxed metadata kicker */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="font-bold text-gray-900">{course.code}</span>
                      <span>·</span>
                      <span>{course.semester}</span>
                      <span>·</span>
                      <span>{course.credits} Credits</span>
                    </div>

                    {isEnrolled ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Enrolled</span>
                      </span>
                    ) : (
                      <span className="text-gray-500">
                        {openSeats} seats open
                      </span>
                    )}
                  </div>

                  {/* Course Title */}
                  <div>
                    <h3
                      onClick={() => openSyllabus(course)}
                      className="text-base font-semibold text-gray-900 leading-snug hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {course.department} · {course.instructor}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {course.description}
                  </p>

                  {/* Syllabus Modules Preview */}
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-700">
                        Syllabus Units ({course.syllabusModules.length} Modules):
                      </span>
                      <button
                        type="button"
                        onClick={() => openSyllabus(course)}
                        className="text-blue-600 hover:underline font-semibold text-[11px]"
                      >
                        View Full Syllabus
                      </button>
                    </div>
                    <p className="text-gray-500 line-clamp-1 leading-normal">
                      {course.syllabusModules.join(' · ')}
                    </p>
                  </div>
                </div>

                {/* Bottom Actions Row (Balanced & Aligned) */}
                <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openSyllabus(course)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>Detailed Syllabus</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/tests')}
                      className="px-3 py-1.5 rounded-lg text-gray-600 hover:text-blue-600 font-medium transition-colors"
                      title="View Practice Tests & Examination Series"
                    >
                      <span>{course.associatedTestsCount} Tests</span>
                    </button>
                  </div>

                  <div className="shrink-0">
                    {isEnrolled ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleUnenroll(course)}
                          className="text-gray-400 hover:text-red-600 text-xs font-medium transition-colors"
                        >
                          Drop
                        </button>
                        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-semibold text-xs flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Registered</span>
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={isRegistering}
                        onClick={() => handleRegister(course)}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-2xs flex items-center gap-1"
                      >
                        <span>{isRegistering ? 'Registering...' : 'Register Course'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Dedicated Course Syllabus Modal */}
      <CourseSyllabusModal
        course={syllabusCourse}
        isOpen={isSyllabusModalOpen}
        onClose={() => {
          setIsSyllabusModalOpen(false);
          setSyllabusCourse(null);
        }}
        onEnroll={handleRegister}
        isEnrolled={syllabusCourse ? isEnrolledInCourse(syllabusCourse.id) : false}
      />
    </div>
  );
};
