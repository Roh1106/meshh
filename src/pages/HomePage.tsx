import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Users,
  Compass,
  ArrowRight,
  Clock,
  Radio,
  FileText,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  Award,
  Layers,
  Check,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { DEFAULT_CAMPUS } from '../constants/app';
import { useOffline } from '../context/OfflineContext';
import { useAuth } from '../context/AuthContext';
import { INITIAL_PEERS } from '../services/peerService';
import { courseService, Course } from '../services/courseService';
import { testSeriesService, AcademicTestSeries } from '../services/testSeriesService';
import { resourceService } from '../services/resourceService';
import { AcademicResource } from '../types';
import { CourseSyllabusModal } from '../components/domain/CourseSyllabusModal';
import { TestSeriesModal } from '../components/domain/TestSeriesModal';
import { PdfViewerModal, PdfDocument } from '../components/common/PdfViewerModal';
import { useToast } from '../context/ToastContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const { effectiveOffline, lastSyncedText, isSyncing, discoverablePeersCount } = useOffline();
  const { currentUser, isAdmin, isEnrolledInCourse, enrollInCourse } = useAuth();
  const [homeQuery, setHomeQuery] = useState('');

  // Loaded Data for balanced sections
  const [courses, setCourses] = useState<Course[]>([]);
  const [testSeriesList, setTestSeriesList] = useState<AcademicTestSeries[]>([]);
  const [downloadedBooks, setDownloadedBooks] = useState<AcademicResource[]>([]);
  const [selectedCourseForSyllabus, setSelectedCourseForSyllabus] = useState<Course | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<AcademicTestSeries | null>(null);
  const [selectedPdfBook, setSelectedPdfBook] = useState<PdfDocument | null>(null);

  useEffect(() => {
    courseService.getCourses().then((list) => setCourses(list));
    testSeriesService.getAllSeries().then((list) => setTestSeriesList(list));
    resourceService.getResources({ offlineOnly: true }).then((list) => setDownloadedBooks(list));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (homeQuery.trim()) {
      navigate(`/discover?q=${encodeURIComponent(homeQuery)}`);
    } else {
      navigate('/discover');
    }
  };

  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const enrolledCourses = courses.filter((c) => isEnrolledInCourse(c.id));
  const totalEnrolledCredits = enrolledCourses.reduce((acc, c) => acc + c.credits, 0);

  return (
    <div className="space-y-6 pb-14">
      {/* Top Greeting & Campus Verification */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {getGreetingTime()}, {currentUser.name.split(' ')[0]}
            </h1>
            {isAdmin && (
              <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-xs font-bold font-mono">
                Faculty Admin
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {DEFAULT_CAMPUS.name} · {currentUser.department} {currentUser.year ? `· ${currentUser.year}` : ''}
          </p>
        </div>

        {/* Live Synchronization Status */}
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium ${
              effectiveOffline
                ? 'bg-gray-100 text-gray-700 border border-gray-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                effectiveOffline ? 'bg-gray-500' : 'bg-emerald-600'
              }`}
            />
            <span>{effectiveOffline ? 'Offline Mode' : isSyncing ? 'Syncing...' : lastSyncedText}</span>
          </span>
        </div>
      </div>

      {/* Admin Notice Banner (If Admin Role Active) */}
      {isAdmin && (
        <div className="bg-purple-50/90 border border-purple-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-purple-950">Faculty Administrator Portal</h3>
                <span className="px-1.5 py-0.2 bg-purple-200/80 text-purple-900 text-[10px] font-bold rounded">
                  Admin Active
                </span>
              </div>
              <p className="text-xs text-purple-800 mt-0.5">
                Manage course registrations, verify student enrollments, and publish academic test series.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors shadow-2xs flex items-center justify-center gap-1.5"
          >
            <span>Open Admin Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Global Academic Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none top-3.5" />
        <input
          type="text"
          value={homeQuery}
          onChange={(e) => setHomeQuery(e.target.value)}
          placeholder="Search syllabus units, test series, courses, or peer study notes..."
          className="w-full h-11 pl-10 pr-24 bg-white text-gray-900 text-xs sm:text-sm rounded-xl border border-gray-200/90 shadow-2xs focus:ring-1 focus:ring-blue-600 focus:outline-none placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
        >
          <span>Search</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* 3 EQUAL BALANCED PRIMARY ACTION PILLARS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: Courses & Syllabus */}
        <div
          onClick={() => navigate('/courses')}
          className="p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <BookOpen className="w-4.5 h-4.5" />
              </div>
              <span className="font-mono text-xs font-bold text-blue-700">
                {enrolledCourses.length} Enrolled
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
              Course Registrations & Syllabus
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Explore 6-unit lecture syllabus plans, textbook recommendations, and degree credits.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-blue-600 font-semibold">
            <span>View All Courses</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Pillar 2: Academic Test Series */}
        <div
          onClick={() => navigate('/tests')}
          className="p-5 bg-white rounded-xl border border-gray-200 hover:border-purple-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                <Award className="w-4.5 h-4.5" />
              </div>
              <span className="font-mono text-xs font-bold text-purple-700">
                {testSeriesList.length} Tracks Active
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm group-hover:text-purple-600 transition-colors">
              Academic Test Series Hub
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Multi-paper GATE & university simulated mock series with cohort percentiles and rankings.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-purple-600 font-semibold">
            <span>Explore Test Series</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Pillar 3: Campus Peer Network */}
        <div
          onClick={() => navigate('/discover')}
          className="p-5 bg-white rounded-xl border border-gray-200 hover:border-emerald-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                <Radio className="w-4.5 h-4.5" />
              </div>
              <span className="font-mono text-xs font-bold text-emerald-800">
                {discoverablePeersCount} Active Nodes
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm group-hover:text-emerald-700 transition-colors">
              Campus Peer Mesh Network
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Bluetooth & Wi-Fi Direct peer learning, 1-on-1 mentorship, and skill exchanges.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
            <span>Connect with Peers</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* EQUAL-BALANCE SECTION 1: FEATURED ACADEMIC TEST SERIES ("text serire") */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
              Featured Academic Test Series
            </h2>
            <p className="text-xs text-gray-500">
              Proctored multi-paper exam series prepared by BVCOE departmental faculty.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/tests')}
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>All Series ({testSeriesList.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testSeriesList.slice(0, 3).map((series) => (
            <div
              key={series.id}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs hover:border-gray-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                  <span className="font-bold text-gray-900">{series.seriesCode}</span>
                  <span className="text-purple-700 font-semibold">{series.difficulty}</span>
                </div>

                <h4
                  onClick={() => setSelectedSeries(series)}
                  className="font-semibold text-sm text-gray-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2 leading-snug"
                >
                  {series.title}
                </h4>

                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {series.description}
                </p>

                <div className="pt-1 text-[11px] text-gray-500 flex items-center justify-between border-t border-gray-100">
                  <span>{series.totalTests} Examination Papers</span>
                  <span>Target: {series.targetExamDate}</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-mono">
                  {series.enrolledStudentsCount} Candidates
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedSeries(series)}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  View Series Papers
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EQUAL-BALANCE SECTION 2: SEMESTER COURSE CURRICULUM & SYLLABUS UNITS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
              Semester Course Curriculum & Syllabus Units
            </h2>
            <p className="text-xs text-gray-500">
              Official university credit courses with 6-unit syllabus breakdowns and textbooks.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/courses')}
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>All Courses ({courses.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.slice(0, 3).map((course) => {
            const isEnrolled = isEnrolledInCourse(course.id);
            return (
              <div
                key={course.id}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs hover:border-gray-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                    <span className="font-bold text-gray-900">{course.code}</span>
                    <span className="text-blue-700 font-semibold">{course.credits} Credits</span>
                  </div>

                  <h4
                    onClick={() => setSelectedCourseForSyllabus(course)}
                    className="font-semibold text-sm text-gray-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2 leading-snug"
                  >
                    {course.title}
                  </h4>

                  <p className="text-xs text-gray-500">{course.department} · {course.instructor}</p>

                  <div className="p-2.5 bg-gray-50 rounded-lg text-xs text-gray-600 space-y-1">
                    <span className="font-semibold text-[11px] text-gray-700 block">
                      Syllabus Breakdown:
                    </span>
                    <p className="text-[11px] text-gray-500 line-clamp-1">
                      {course.syllabusModules.join(' · ')}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedCourseForSyllabus(course)}
                    className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>View Syllabus</span>
                  </button>

                  {isEnrolled ? (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Enrolled</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        enrollInCourse(course.id);
                        showSuccess(`Registered for ${course.code}`);
                      }}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold"
                    >
                      Register
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* EQUAL-BALANCE SECTION 3: RECENT PEER COLLABORATION & STUDY SESSIONS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
              Peer Learning & Mentorship Roster
            </h2>
            <p className="text-xs text-gray-500">
              Available departmental mentors and peer study partners near campus nodes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/discover')}
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>All Peers ({INITIAL_PEERS.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_PEERS.slice(0, 2).map((peer) => (
            <div
              key={peer.id}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs hover:border-gray-300 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <img
                  src={peer.avatar}
                  alt={peer.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-gray-900 truncate">{peer.name}</h4>
                    <span className="text-xs text-gray-500 font-mono">Rating {peer.rating.toFixed(1)}/5.0</span>
                  </div>
                  <p className="text-xs text-gray-500">{peer.department} · {peer.year}</p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                    Teaches: {peer.canTeach.join(', ')}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400">{peer.location}</span>
                <button
                  type="button"
                  onClick={() => navigate('/discover')}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Book Study Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EQUAL-BALANCE SECTION 4: DOWNLOADED BOOKS & STUDY GUIDES (OFFLINE READY) */}
      {downloadedBooks.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
                  Downloaded Books & Offline Material
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Cached Locally
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Official textbook summaries and formula guides ready for direct reading anytime.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/saved')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Saved Items & Books</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {downloadedBooks.slice(0, 2).map((book) => (
              <div
                key={book.id}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs hover:border-gray-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                    <span className="font-bold text-gray-900">{book.subject}</span>
                    <span className="text-emerald-700 font-semibold">{book.format} · {book.fileSize}</span>
                  </div>

                  <h4
                    onClick={() =>
                      setSelectedPdfBook({
                        id: book.id,
                        title: book.title,
                        subject: book.subject,
                        department: book.department,
                        fileSize: book.fileSize,
                        authorOrSource: `${book.author} (${book.authorRole || 'Faculty'})`,
                      })
                    }
                    className="font-semibold text-sm text-gray-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-1 leading-snug"
                  >
                    {book.title}
                  </h4>

                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {book.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">
                    By {book.author}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPdfBook({
                        id: book.id,
                        title: book.title,
                        subject: book.subject,
                        department: book.department,
                        fileSize: book.fileSize,
                        authorOrSource: `${book.author} (${book.authorRole || 'Faculty'})`,
                      })
                    }
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Open PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Modals for Syllabus, Test Series, and PDF Reader */}
      <CourseSyllabusModal
        course={selectedCourseForSyllabus}
        isOpen={!!selectedCourseForSyllabus}
        onClose={() => setSelectedCourseForSyllabus(null)}
      />

      <TestSeriesModal
        series={selectedSeries}
        isOpen={!!selectedSeries}
        onClose={() => setSelectedSeries(null)}
        onToggleEnroll={async (seriesId) => {
          await testSeriesService.toggleEnrollSeries(seriesId);
          const updated = await testSeriesService.getAllSeries();
          setTestSeriesList(updated);
        }}
      />

      <PdfViewerModal
        document={selectedPdfBook}
        isOpen={!!selectedPdfBook}
        onClose={() => setSelectedPdfBook(null)}
      />
    </div>
  );
};
