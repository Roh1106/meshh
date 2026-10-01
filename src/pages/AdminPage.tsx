import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { courseService, StudentRegistrationRecord, Course } from '../services/courseService';
import { resourceService } from '../services/resourceService';
import { karmaRepository } from '../repositories';
import { testService } from '../services/testService';
import { AcademicResource, PracticeTest } from '../types';
import {
  ShieldCheck,
  Users,
  CheckCircle,
  BookOpen,
  FileText,
  Award,
  Layers,
  Search,
  Download,
  Plus,
  ArrowRight,
  UserPlus,
  Check,
  Trash2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { DEFAULT_CAMPUS } from '../constants/app';
import { Modal } from '../components/common/Modal';
import { CourseSyllabusModal } from '../components/domain/CourseSyllabusModal';

export const AdminPage: React.FC = () => {
  const {
    currentUser,
    isAdmin,
    availableUsers,
    switchUser,
    openLoginModal,
    adminEnrollStudentInCourse,
  } = useAuth();
  const { showSuccess, showInfo, showError } = useToast();

  const [registrations, setRegistrations] = useState<StudentRegistrationRecord[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [resources, setResources] = useState<AcademicResource[]>([]);
  const [tests, setTests] = useState<PracticeTest[]>([]);
  const [activeTab, setActiveTab] = useState<'registrations' | 'courses' | 'resources' | 'tests'>('registrations');
  const [searchQuery, setSearchQuery] = useState('');
  const [syllabusCourse, setSyllabusCourse] = useState<Course | null>(null);
  const [reviewingResource, setReviewingResource] = useState<AcademicResource | null>(null);
  const [reviewPdfUrl, setReviewPdfUrl] = useState<string | null>(null);
  const [hasReadReviewPdf, setHasReadReviewPdf] = useState(false);

  // Register Student Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [isRegisteringStudent, setIsRegisteringStudent] = useState(false);

  // Add Course Modal State
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDept, setNewCourseDept] = useState(DEFAULT_CAMPUS.departmentList[0]);
  const [newCourseSemester, setNewCourseSemester] = useState('Semester 5');
  const [newCourseCredits, setNewCourseCredits] = useState(4);
  const [newCourseInstructor, setNewCourseInstructor] = useState('Prof. S. Kulkarni');
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [newCourseSeats, setNewCourseSeats] = useState(70);
  const [isAddingCourse, setIsAddingCourse] = useState(false);

  // Add Test Modal State
  const [isAddTestModalOpen, setIsAddTestModalOpen] = useState(false);
  const [newTestTitle, setNewTestTitle] = useState('');
  const [newTestSubject, setNewTestSubject] = useState('Data Structures & Algorithms');
  const [newTestDifficulty, setNewTestDifficulty] = useState<'Higher / Mastery' | 'Advanced'>('Higher / Mastery');
  const [newTestCourseId, setNewTestCourseId] = useState('');

  useEffect(() => {
    let mounted = true;
    const loadAdminData = async () => {
      try {
        const [regs, courseList, resList, testList] = await Promise.all([
          courseService.getAllRegistrations(),
          courseService.getCourses(),
          resourceService.getResources({ includePending: true }),
          testService.getTests(),
        ]);
        if (mounted) {
          setRegistrations(regs);
          setCourses(courseList);
          setResources(resList);
          setTests(testList);
          if (courseList.length > 0) {
            setSelectedCourseId(courseList[0].id);
            setNewTestCourseId(courseList[0].id);
          }
          const students = availableUsers.filter((u) => u.role !== 'admin');
          if (students.length > 0) {
            setSelectedStudentId(students[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load admin records', err);
      }
    };
    loadAdminData();
    return () => {
      mounted = false;
    };
  }, [availableUsers]);

  const handleAdminRegisterStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const student = availableUsers.find((u) => u.id === selectedStudentId);
    const course = courses.find((c) => c.id === selectedCourseId);

    if (!student || !course) {
      showError('Please select both a valid student and a course.');
      return;
    }

    setIsRegisteringStudent(true);
    try {
      // 1. Update AuthContext for student
      await adminEnrollStudentInCourse(student.id, course.id);

      // 2. Register in CourseService roster
      const reg = await courseService.registerStudentForCourse(
        {
          id: student.id,
          name: student.name,
          rollNo: student.rollNo,
          department: student.department,
        },
        course
      );

      // 3. Update local state
      setRegistrations((prev) => {
        if (prev.some((r) => r.id === reg.id)) return prev;
        return [reg, ...prev];
      });

      // Update course count
      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? { ...c, enrolledStudentsCount: c.enrolledStudentsCount + 1 } : c))
      );

      showSuccess(
        `Enrolled student ${student.name} (${student.rollNo}) into ${course.code}: ${course.title}.`,
        'Enrollment Confirmed'
      );
      setIsRegisterModalOpen(false);
    } catch {
      showError('Failed to enroll student in course.');
    } finally {
      setIsRegisteringStudent(false);
    }
  };

  const handleAdminAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseCode.trim() || !newCourseTitle.trim()) {
      showError('Please fill in Course Code and Title.');
      return;
    }

    setIsAddingCourse(true);
    try {
      const created = await courseService.addCourse({
        id: `course_${Date.now()}`,
        code: newCourseCode.trim().toUpperCase(),
        title: newCourseTitle.trim(),
        department: newCourseDept,
        semester: newCourseSemester,
        credits: Number(newCourseCredits),
        instructor: newCourseInstructor.trim() || 'BVCOE Faculty',
        description: newCourseDescription.trim() || `Departmental course offering for ${newCourseDept}.`,
        syllabusModules: [
          'Module 1: Foundations & Analytical Framework',
          'Module 2: Core Engineering Paradigms & Synthesis',
          'Module 3: Laboratory Experiments & Project Work',
          'Module 4: Emerging Trends & Industrial Applications',
        ],
        enrolledStudentsCount: 0,
        availableSeats: Number(newCourseSeats) || 70,
        associatedTestsCount: 2,
      });

      setCourses((prev) => [created, ...prev]);
      showSuccess(`Added new course ${created.code}: ${created.title} to BVCOE curriculum.`);
      setIsAddCourseModalOpen(false);
      setNewCourseCode('');
      setNewCourseTitle('');
      setNewCourseDescription('');
    } catch {
      showError('Failed to create course.');
    } finally {
      setIsAddingCourse(false);
    }
  };

  const handleApproveRegistration = (id: string) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
    );
    showSuccess('Student course registration verified & officially approved.');
  };

  const handleOpenResourceForReview = async (resource: AcademicResource) => {
    const fileUrl = await resourceService.getResourceFileUrl(resource.id);
    if (!fileUrl) {
      showError('The submitted PDF is not available in this browser. Ask the student to submit it again.');
      return;
    }
    setReviewingResource(resource);
    setReviewPdfUrl(fileUrl);
    setHasReadReviewPdf(false);
  };

  const closeResourceReview = () => {
    if (reviewPdfUrl) URL.revokeObjectURL(reviewPdfUrl);
    setReviewingResource(null);
    setReviewPdfUrl(null);
    setHasReadReviewPdf(false);
  };

  const handleResourceDecision = async (status: 'approved' | 'rejected') => {
    if (!reviewingResource || !hasReadReviewPdf) return;
    const updated = await resourceService.setApprovalStatus(reviewingResource.id, status, currentUser.name);
    if (!updated) return;

    setResources((previous) => previous.map((resource) => resource.id === updated.id ? updated : resource));
    if (status === 'approved' && updated.submittedById) {
      await karmaRepository.addTransaction({
        userId: updated.submittedById,
        amount: 15,
        action: 'resource_contribution',
        description: `Administrator approved resource: ${updated.title}`,
        referenceId: updated.id,
      });
    }
    showSuccess(status === 'approved'
      ? `"${updated.title}" was approved and is now visible to students.`
      : `"${updated.title}" was rejected and will remain hidden from students.`);
    closeResourceReview();
  };

  const handleCreateHigherTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestTitle.trim()) return;

    const targetCourse = courses.find((c) => c.id === newTestCourseId) || courses[0];

    const created = await testService.addTest({
      id: `test_custom_${Date.now()}`,
      title: newTestTitle,
      subject: targetCourse ? targetCourse.title : newTestSubject,
      courseId: targetCourse ? targetCourse.id : undefined,
      department: targetCourse ? targetCourse.department : 'Computer Science & Eng.',
      questionsCount: 5,
      durationMinutes: 25,
      difficulty: newTestDifficulty,
      isHigherTest: newTestDifficulty === 'Higher / Mastery',
      semester: targetCourse ? targetCourse.semester : 'Semester 5',
      attemptsCount: 0,
      isAvailableOffline: true,
      freelyAvailableResources: [
        {
          id: `fr_custom_${Date.now()}`,
          title: `${targetCourse ? targetCourse.title : newTestSubject} Faculty Curriculum Reference`,
          type: 'Lecture Notes',
          size: '1.5 MB',
          description: 'Faculty-prepared syllabus reference notes with worked numericals and derivations.',
          authorOrSource: `${currentUser.name} · BVCOE Faculty Admin`,
        },
        {
          id: `fr_custom_pyq_${Date.now()}`,
          title: 'Department PYQ Revision & Practice Problem Sheet',
          type: 'PDF Guide',
          size: '2.1 MB',
          description: 'Official test prep problem bank with step-by-step solutions.',
          authorOrSource: 'BVCOE Academic Examination Cell',
        },
      ],
      questions: [
        {
          id: 'cq1',
          prompt: `Diagnostic Examination Problem for ${newTestTitle}: Evaluate the worst-case asymptotic bounds and resource complexity under heavy load.`,
          options: ['O(log N) with concurrent memory barriers', 'O(N^2) serial blocking', 'O(1) amortized', 'O(N log N)'],
          correctIndex: 0,
          explanation: 'Verified theoretical solution certified by the BVCOE department examination board.',
        },
        {
          id: 'cq2',
          prompt: 'Which invariant must be maintained during high-concurrency execution to prevent race conditions?',
          options: ['Mutual exclusion on shared mutable state', 'Unbounded recursion', 'Global variable modification without locks', 'Disabling timer interrupts'],
          correctIndex: 0,
          explanation: 'Critical sections require mutual exclusion via synchronization primitives (mutex/atomic instructions).',
        },
      ],
    });

    setTests((prev) => [created, ...prev]);
    showSuccess(`Published higher-level examination test: "${newTestTitle}" to campus mesh.`);
    setIsAddTestModalOpen(false);
    setNewTestTitle('');
  };

  if (!isAdmin) {
    return (
      <div className="py-12 max-w-lg mx-auto text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto shadow-xs">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Administrator Console</h2>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          You are currently signed in as a student (<strong>{currentUser.name}</strong>). To register students for courses, add new courses to the curriculum, certify resources, and publish higher tests, switch to an Administrator login.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
          <button
            onClick={() => switchUser('usr_admin_dr_rao')}
            className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            1-Click Login as Admin (Dr. P. B. Rao)
          </button>
          <button
            onClick={openLoginModal}
            className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-medium"
          >
            Switch Other Profiles
          </button>
        </div>
      </div>
    );
  }

  const filteredRegistrations = registrations.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.studentName.toLowerCase().includes(q) ||
      r.studentRoll.toLowerCase().includes(q) ||
      r.courseCode.toLowerCase().includes(q) ||
      r.courseTitle.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Campus Administration & Academic Controller"
        description={`${DEFAULT_CAMPUS.name} (${DEFAULT_CAMPUS.shortName}) · Course Registrations, Exams & Catalog`}
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Student</span>
            </button>

            <button
              onClick={() => setIsAddCourseModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Course</span>
            </button>

            <button
              onClick={() => setIsAddTestModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700 transition-colors shadow-2xs"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Create Higher Test</span>
            </button>
          </div>
        }
      />

      {/* Admin KPI Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-gray-200/90 shadow-2xs">
          <span className="text-[11px] text-gray-500 font-medium">Student Enrollments</span>
          <p className="text-xl font-bold text-gray-900 mt-0.5">{registrations.length} Active</p>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-gray-200/90 shadow-2xs">
          <span className="text-[11px] text-gray-500 font-medium">Offered Courses</span>
          <p className="text-xl font-bold text-blue-600 mt-0.5">{courses.length} Courses</p>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-gray-200/90 shadow-2xs">
          <span className="text-[11px] text-gray-500 font-medium">Free Study Materials</span>
          <p className="text-xl font-bold text-emerald-700 mt-0.5">{resources.length} Guides</p>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-gray-200/90 shadow-2xs">
          <span className="text-[11px] text-gray-500 font-medium">Higher Exams & Quizzes</span>
          <p className="text-xl font-bold text-purple-700 mt-0.5">
            {tests.filter((t) => t.isHigherTest).length} Higher / {tests.length} Total
          </p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-1 bg-gray-200/60 p-1 rounded-lg text-xs font-medium w-full overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('registrations')}
          className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
            activeTab === 'registrations'
              ? 'bg-white text-blue-600 font-semibold shadow-2xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Course Registrations ({registrations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
            activeTab === 'courses'
              ? 'bg-white text-blue-600 font-semibold shadow-2xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Course Catalog ({courses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
            activeTab === 'resources'
              ? 'bg-white text-blue-600 font-semibold shadow-2xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
            <span>Resource Review ({resources.filter((resource) => resource.approvalStatus === 'pending').length} pending)</span>
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
            activeTab === 'tests'
              ? 'bg-white text-blue-600 font-semibold shadow-2xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Higher Tests & Exams ({tests.length})</span>
        </button>
      </div>

      {/* TAB 1: STUDENT COURSE REGISTRATIONS */}
      {activeTab === 'registrations' && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, roll no, course..."
                className="w-full h-8 pl-8 pr-2.5 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">
                Showing <strong>{filteredRegistrations.length}</strong> student registrations
              </span>
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="px-2.5 py-1 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 flex items-center gap-1"
              >
                <UserPlus className="w-3 h-3" />
                <span>Register Student</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200/90 divide-y divide-gray-100 shadow-xs overflow-hidden">
            {filteredRegistrations.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-xs">
                No registrations found matching &quot;{searchQuery}&quot;.
              </div>
            ) : (
              filteredRegistrations.map((reg) => (
                <div
                  key={reg.id}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-gray-50/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{reg.studentName}</span>
                      <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-mono text-[11px] font-semibold">
                        {reg.studentRoll}
                      </span>
                      <span className="text-gray-500">· {reg.studentDepartment}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-gray-600">
                      <span className="font-semibold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded text-[11px]">
                        {reg.courseCode}
                      </span>
                      <span className="font-medium">{reg.courseTitle}</span>
                      <span className="text-gray-400">· Enrolled {reg.registeredAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        reg.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {reg.status}
                    </span>

                    {reg.status !== 'Approved' && (
                      <button
                        onClick={() => handleApproveRegistration(reg.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Approve</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: COURSE CATALOG */}
      {activeTab === 'courses' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Bharati Vidyapeeth College of Engineering Curriculum & Offerings</span>
            <button
              onClick={() => setIsAddCourseModalOpen(true)}
              className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Course</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-mono font-bold">
                      {course.code}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">{course.semester}</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700">
                    {course.credits} Credits
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-gray-900">{course.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{course.description}</p>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>Instructor: <strong>{course.instructor}</strong></span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSyllabusCourse(course)}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      View Syllabus
                    </button>
                    <span>·</span>
                    <span className="font-semibold text-gray-700">
                      {course.enrolledStudentsCount} / {course.availableSeats} enrolled
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FREELY AVAILABLE RESOURCES */}
      {activeTab === 'resources' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Read each student-submitted PDF before approving it for the student library.</span>
          </div>

          <div className="bg-white rounded-xl border border-gray-200/90 divide-y divide-gray-100 shadow-xs">
            {resources.map((res) => (
              <div key={res.id} className="p-3.5 flex items-start justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">{res.title}</span>
                    <span className="px-1.5 py-0.2 bg-gray-100 text-gray-700 rounded text-[11px]">
                      {res.format} · {res.fileSize}
                    </span>
                    {res.approvalStatus === 'pending' && (
                      <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded text-[11px] font-semibold">Pending review</span>
                    )}
                    {res.approvalStatus === 'rejected' && (
                      <span className="px-1.5 py-0.2 bg-red-100 text-red-800 rounded text-[11px] font-semibold">Rejected</span>
                    )}
                    {(res.verified || res.approvalStatus === 'approved') && (
                      <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[11px] font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>{res.verifiedBy || 'Approved'}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {res.subject} · Contributed by {res.author}
                  </p>
                  <p className="text-gray-600 text-xs mt-1">{res.description}</p>
                </div>

                {res.approvalStatus === 'pending' && (
                  <button
                    onClick={() => void handleOpenResourceForReview(res)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shrink-0"
                  >
                    Read & Review PDF
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: HIGHER TESTS BANK */}
      {activeTab === 'tests' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Mastery and GATE-Level Examination Quizzes</span>
            <button
              onClick={() => setIsAddTestModalOpen(true)}
              className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Higher Test</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tests.map((test) => (
              <div
                key={test.id}
                className={`bg-white rounded-xl border p-4 shadow-xs space-y-2.5 ${
                  test.isHigherTest ? 'border-purple-300 ring-1 ring-purple-100' : 'border-gray-200/90'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[11px] font-semibold">
                    {test.subject}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      test.isHigherTest
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {test.difficulty}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-gray-900 leading-snug">{test.title}</h3>

                {test.freelyAvailableResources && test.freelyAvailableResources.length > 0 && (
                  <div className="text-[11px] text-blue-700 font-medium flex items-center gap-1 bg-blue-50/70 p-1.5 rounded">
                    <FileText className="w-3 h-3" />
                    <span>{test.freelyAvailableResources.length} Free Prep Materials Attached</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <span>{test.durationMinutes} mins · {test.questionsCount} questions</span>
                  <span>{test.attemptsCount} attempts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal 1: Register Student For Course */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Register Student for Course"
        description="Select an enrolled BVCOE student and assign them to a semester course."
      >
        <form onSubmit={handleAdminRegisterStudent} className="space-y-3.5 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Select Student *
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              {availableUsers
                .filter((u) => u.role !== 'admin')
                .map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.rollNo}) - {student.department} ({student.year})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Select Course to Enroll *
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}: {c.title} ({c.semester} · {c.credits} Credits · {c.availableSeats - c.enrolledStudentsCount} seats left)
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-900 border border-blue-100">
            <strong>Administrator Note:</strong> Registering the student will immediately grant them access to this course syllabus, linked tests, and attached study resources in offline storage.
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(false)}
              className="w-full h-9 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRegisteringStudent}
              className="w-full h-9 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-2xs"
            >
              {isRegisteringStudent ? 'Enrolling...' : 'Confirm Registration'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!reviewingResource}
        onClose={closeResourceReview}
        title={reviewingResource ? `Review: ${reviewingResource.title}` : 'Review Resource'}
        description="Read the submitted PDF. Approval publishes it to the student resource library."
        maxWidth="lg"
      >
        {reviewingResource && reviewPdfUrl && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <span>Submitted by: <strong>{reviewingResource.author}</strong></span>
              <span>Subject: <strong>{reviewingResource.subject}</strong></span>
            </div>
            <iframe
              title={`Review PDF: ${reviewingResource.title}`}
              src={reviewPdfUrl}
              onLoad={() => setHasReadReviewPdf(true)}
              className="h-[60vh] w-full rounded-lg border border-gray-300"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-gray-500">{hasReadReviewPdf ? 'PDF opened. You may record your review.' : 'Loading submitted PDF…'}</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => void handleResourceDecision('rejected')} disabled={!hasReadReviewPdf} className="px-3 py-2 rounded-lg border border-red-200 text-red-700 text-xs font-semibold disabled:opacity-50">Reject</button>
                <button type="button" onClick={() => void handleResourceDecision('approved')} disabled={!hasReadReviewPdf} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold disabled:opacity-50">Approve & Publish</button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal 2: Add New Course */}
      <Modal
        isOpen={isAddCourseModalOpen}
        onClose={() => setIsAddCourseModalOpen(false)}
        title="Add New Course to BVCOE Curriculum"
        description="Publish a new academic subject with syllabus credits and test requirements."
      >
        <form onSubmit={handleAdminAddCourse} className="space-y-3 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Course Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. CS-708"
                value={newCourseCode}
                onChange={(e) => setNewCourseCode(e.target.value)}
                className="w-full h-8.5 rounded-lg border border-gray-300 px-3 text-xs uppercase font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Credits</label>
              <input
                type="number"
                min="1"
                max="6"
                value={newCourseCredits}
                onChange={(e) => setNewCourseCredits(Number(e.target.value))}
                className="w-full h-8.5 rounded-lg border border-gray-300 px-3 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Course Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Quantum Computing & Quantum Algorithms"
              value={newCourseTitle}
              onChange={(e) => setNewCourseTitle(e.target.value)}
              className="w-full h-8.5 rounded-lg border border-gray-300 px-3 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Department</label>
              <select
                value={newCourseDept}
                onChange={(e) => setNewCourseDept(e.target.value)}
                className="w-full h-8.5 rounded-lg border border-gray-300 px-2.5 text-xs bg-white"
              >
                {DEFAULT_CAMPUS.departmentList.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Semester</label>
              <select
                value={newCourseSemester}
                onChange={(e) => setNewCourseSemester(e.target.value)}
                className="w-full h-8.5 rounded-lg border border-gray-300 px-2.5 text-xs bg-white"
              >
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
                <option value="Semester 7">Semester 7</option>
                <option value="Semester 8">Semester 8</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Instructor Faculty</label>
              <input
                type="text"
                placeholder="Prof. S. Kulkarni"
                value={newCourseInstructor}
                onChange={(e) => setNewCourseInstructor(e.target.value)}
                className="w-full h-8.5 rounded-lg border border-gray-300 px-3 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Available Seats</label>
              <input
                type="number"
                min="10"
                max="200"
                value={newCourseSeats}
                onChange={(e) => setNewCourseSeats(Number(e.target.value))}
                className="w-full h-8.5 rounded-lg border border-gray-300 px-3 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Course Description</label>
            <textarea
              rows={2}
              placeholder="Overview of theoretical concepts, laboratory components, and semester objectives..."
              value={newCourseDescription}
              onChange={(e) => setNewCourseDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddCourseModalOpen(false)}
              className="w-full h-9 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAddingCourse}
              className="w-full h-9 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-2xs"
            >
              {isAddingCourse ? 'Adding...' : 'Create Course'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 3: Add Higher Test */}
      <Modal
        isOpen={isAddTestModalOpen}
        onClose={() => setIsAddTestModalOpen(false)}
        title="Create Higher-Level Diagnostic Test"
        description="Publish challenging mastery questions for semester exams & GATE aspirants."
      >
        <form onSubmit={handleCreateHigherTest} className="space-y-3.5 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Test Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Advanced Operating Systems: Kernel Inode & Memory Subsystem Deep Dive"
              value={newTestTitle}
              onChange={(e) => setNewTestTitle(e.target.value)}
              className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Associated Course</label>
              <select
                value={newTestCourseId}
                onChange={(e) => setNewTestCourseId(e.target.value)}
                className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm bg-white focus:outline-none"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code}: {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Level</label>
              <select
                value={newTestDifficulty}
                onChange={(e) => setNewTestDifficulty(e.target.value as any)}
                className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm bg-white focus:outline-none"
              >
                <option value="Higher / Mastery">Higher / Mastery (Challenging)</option>
                <option value="Advanced">Advanced (End-Sem Exam)</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-xs text-purple-900 space-y-1">
            <span className="font-semibold block">Automatic Free Resources Attachment:</span>
            <p>
              Tests created by Admin automatically attach free syllabus lecture notes and formula
              cheat sheets to guide students before taking the exam.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddTestModalOpen(false)}
              className="w-full h-9 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full h-9 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors shadow-2xs"
            >
              Publish Test
            </button>
          </div>
        </form>
      </Modal>

      {/* Course Syllabus Modal for Admin */}
      <CourseSyllabusModal
        course={syllabusCourse}
        isOpen={!!syllabusCourse}
        onClose={() => setSyllabusCourse(null)}
      />
    </div>
  );
};
