import { PracticeTest } from '../types';

export interface TestSeriesExam {
  id: string;
  title: string;
  examType: 'Diagnostic Sectional' | 'Mid-Term Simulation' | 'GATE University Mock' | 'Full Syllabus Grand Mock';
  questionsCount: number;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  testId: string;
  syllabusCoverage: string;
  scheduledDate: string;
  status: 'Available' | 'Completed' | 'Upcoming';
  userScore?: number;
  rank?: number;
  totalParticipants: number;
}

export interface AcademicTestSeries {
  id: string;
  seriesCode: string;
  title: string;
  department: string;
  semester: string;
  courseId: string;
  courseCode: string;
  category: 'GATE & University Mastery' | 'Semester Proctored Track' | 'Technical Certification';
  description: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced' | 'Mastery';
  enrolledStudentsCount: number;
  totalTests: number;
  completedTestsCount: number;
  totalMarks: number;
  averageScorePercent?: number;
  isRegistered?: boolean;
  benefits: string[];
  targetExamDate: string;
  coordinator: string;
  exams: TestSeriesExam[];
}

const STORAGE_KEY_TEST_SERIES = 'skillmesh_academic_test_series';
const STORAGE_KEY_SERIES_ENROLLMENTS = 'skillmesh_test_series_enrolled_ids';

export const INITIAL_TEST_SERIES: AcademicTestSeries[] = [
  {
    id: 'series_dsa_mastery',
    seriesCode: 'TS-CS301-M',
    title: 'Data Structures & Algorithms GATE & University Series',
    department: 'Computer Science & Eng.',
    semester: 'Semester 3',
    courseId: 'course_dsa',
    courseCode: 'CS-301',
    category: 'GATE & University Mastery',
    description:
      'Structured 4-tier examination series spanning asymptotic recurrences, advanced tree balancing, dynamic programming invariants, and graph cut optimization.',
    difficulty: 'Mastery',
    enrolledStudentsCount: 142,
    totalTests: 3,
    completedTestsCount: 1,
    totalMarks: 300,
    averageScorePercent: 78,
    isRegistered: true,
    benefits: [
      'Comprehensive GATE & End-Semester simulated marking scheme',
      'In-depth step-by-step mathematical derivation keys',
      'Percentile ranking across BVCOE engineering cohort',
      'Offline-cached question sets and performance analytics',
    ],
    targetExamDate: 'Nov 18, 2026',
    coordinator: 'Prof. S. R. Patil',
    exams: [
      {
        id: 'tse_dsa_1',
        title: 'Diagnostic Test: Recurrences, Heaps & AVL Trees',
        examType: 'Diagnostic Sectional',
        questionsCount: 5,
        durationMinutes: 20,
        totalMarks: 50,
        passingMarks: 25,
        testId: 'test_dsa_adv',
        syllabusCoverage: 'Units 1 & 2: Asymptotics, Master Theorem, Balanced Trees',
        scheduledDate: 'Available Now',
        status: 'Completed',
        userScore: 42,
        rank: 14,
        totalParticipants: 142,
      },
      {
        id: 'tse_dsa_2',
        title: 'Higher Mastery Test: Graph Flow & DP Memoization',
        examType: 'GATE University Mock',
        questionsCount: 5,
        durationMinutes: 30,
        totalMarks: 100,
        passingMarks: 50,
        testId: 'test_dsa_higher',
        syllabusCoverage: 'Units 3 & 4: Dijkstra, Bellman-Ford, DAG DP, Floyd-Warshall',
        scheduledDate: 'Available Now',
        status: 'Available',
        totalParticipants: 128,
      },
      {
        id: 'tse_dsa_3',
        title: 'Grand Comprehensive Mock: Full Semester Examination',
        examType: 'Full Syllabus Grand Mock',
        questionsCount: 5,
        durationMinutes: 35,
        totalMarks: 150,
        passingMarks: 75,
        testId: 'test_dsa_adv',
        syllabusCoverage: 'Units 1-6 Complete University Syllabus with Code Complexity Analysis',
        scheduledDate: 'Nov 12, 2026',
        status: 'Available',
        totalParticipants: 95,
      },
    ],
  },
  {
    id: 'series_dbms_architect',
    seriesCode: 'TS-CS402-M',
    title: 'Database Systems Architecture & Query Optimizer Series',
    department: 'Computer Science & Eng.',
    semester: 'Semester 4',
    courseId: 'course_dbms',
    courseCode: 'CS-402',
    category: 'Semester Proctored Track',
    description:
      'Rigorous testing track covering relational algebra calculus, 3NF/BCNF losslessness, strict 2PL serializability schedules, and WAL crash recovery protocols.',
    difficulty: 'Advanced',
    enrolledStudentsCount: 118,
    totalTests: 3,
    completedTestsCount: 0,
    totalMarks: 250,
    averageScorePercent: 82,
    isRegistered: false,
    benefits: [
      'Official relational schema decomposition practice sets',
      'Concurrency conflict-serializability state analysis',
      'Faculty-reviewed answer keys with query execution plan graphs',
    ],
    targetExamDate: 'Nov 24, 2026',
    coordinator: 'Dr. P. B. Rao (HOD)',
    exams: [
      {
        id: 'tse_dbms_1',
        title: 'Sectional Assessment: Normalization & Dependency Preservation',
        examType: 'Diagnostic Sectional',
        questionsCount: 5,
        durationMinutes: 20,
        totalMarks: 50,
        passingMarks: 25,
        testId: 'test_dbms_norm',
        syllabusCoverage: 'Unit 2: 1NF to BCNF, Minimal Covers, Lossless Join Verification',
        scheduledDate: 'Available Now',
        status: 'Available',
        totalParticipants: 118,
      },
      {
        id: 'tse_dbms_2',
        title: 'Higher Exam: ACID Invariants, MVCC & ARIES Recovery',
        examType: 'GATE University Mock',
        questionsCount: 5,
        durationMinutes: 25,
        totalMarks: 100,
        passingMarks: 50,
        testId: 'test_dbms_higher',
        syllabusCoverage: 'Units 3 & 4: Strict 2PL, Lock Escalation, Write-Ahead Logging',
        scheduledDate: 'Available Now',
        status: 'Available',
        totalParticipants: 104,
      },
      {
        id: 'tse_dbms_3',
        title: 'Final Proctored Simulation: Query Optimization & Indexing',
        examType: 'Full Syllabus Grand Mock',
        questionsCount: 5,
        durationMinutes: 30,
        totalMarks: 100,
        passingMarks: 50,
        testId: 'test_dbms_higher',
        syllabusCoverage: 'Full Semester Syllabus (B+ Trees, Cost-based Query Optimization)',
        scheduledDate: 'Nov 19, 2026',
        status: 'Available',
        totalParticipants: 88,
      },
    ],
  },
  {
    id: 'series_cn_protocols',
    seriesCode: 'TS-IT501-M',
    title: 'Computer Networks & Internetworking Protocols Test Series',
    department: 'Information Technology',
    semester: 'Semester 5',
    courseId: 'course_cn',
    courseCode: 'IT-501',
    category: 'GATE & University Mastery',
    description:
      'In-depth packet protocol evaluation covering TCP congestion control (Cubic vs BBR), BGP inter-domain path vector selection, and TLS 1.3 cryptographic handshakes.',
    difficulty: 'Mastery',
    enrolledStudentsCount: 96,
    totalTests: 2,
    completedTestsCount: 0,
    totalMarks: 200,
    averageScorePercent: 74,
    isRegistered: false,
    benefits: [
      'Packet trace Wireshark scenario problems',
      'CIDR subnetting and router forwarding table exercises',
      'Simulated university semester format',
    ],
    targetExamDate: 'Dec 02, 2026',
    coordinator: 'Prof. Aniket Joshi',
    exams: [
      {
        id: 'tse_cn_1',
        title: 'Core Protocols: TCP Flow, Sliding Windows & BBR',
        examType: 'Diagnostic Sectional',
        questionsCount: 5,
        durationMinutes: 25,
        totalMarks: 100,
        passingMarks: 45,
        testId: 'test_cn_standard',
        syllabusCoverage: 'Units 1-3: Physical, Data Link, TCP/IP Layer & Congestion Control',
        scheduledDate: 'Available Now',
        status: 'Available',
        totalParticipants: 96,
      },
      {
        id: 'tse_cn_2',
        title: 'Higher Mastery: BGP Routing, Subnetting & TLS 1.3 Handshake',
        examType: 'GATE University Mock',
        questionsCount: 5,
        durationMinutes: 30,
        totalMarks: 100,
        passingMarks: 50,
        testId: 'test_cn_higher',
        syllabusCoverage: 'Units 4-6: BGP Path Attributes, AS Paths, Symmetric Cryptography',
        scheduledDate: 'Available Now',
        status: 'Available',
        totalParticipants: 79,
      },
    ],
  },
  {
    id: 'series_vlsi_chip',
    seriesCode: 'TS-EC601-M',
    title: 'CMOS VLSI Design & Static Timing Verification Series',
    department: 'Electronics & Comm. (ECE)',
    semester: 'Semester 6',
    courseId: 'course_vlsi',
    courseCode: 'EC-601',
    category: 'Technical Certification',
    description:
      'Digital ASIC test series covering MOSFET scaling limits, CMOS propagation delays, setup/hold slack calculations, and synthesizable Verilog HDL verification.',
    difficulty: 'Advanced',
    enrolledStudentsCount: 84,
    totalTests: 2,
    completedTestsCount: 0,
    totalMarks: 200,
    averageScorePercent: 80,
    isRegistered: false,
    benefits: [
      'Static Timing Analysis (STA) setup & hold violation problem sets',
      'Logical effort and buffer insertion optimization exercises',
      'ASIC backend fabrication rules and layout design rules',
    ],
    targetExamDate: 'Dec 08, 2026',
    coordinator: 'Dr. V. K. Sharma',
    exams: [
      {
        id: 'tse_vlsi_1',
        title: 'CMOS Fundamentals: Inverter VTC & Fan-Out Sizing',
        examType: 'Diagnostic Sectional',
        questionsCount: 5,
        durationMinutes: 25,
        totalMarks: 100,
        passingMarks: 40,
        testId: 'test_vlsi_standard',
        syllabusCoverage: 'Units 1 & 2: MOS Physics, VTC Transfer Curve, Static Power',
        scheduledDate: 'Available Now',
        status: 'Available',
        totalParticipants: 84,
      },
      {
        id: 'tse_vlsi_2',
        title: 'Higher Exam: Static Timing Analysis & Clock Skew Budgeting',
        examType: 'GATE University Mock',
        questionsCount: 5,
        durationMinutes: 30,
        totalMarks: 100,
        passingMarks: 50,
        testId: 'test_vlsi_higher',
        syllabusCoverage: 'Units 3-5: Setup/Hold Slack, Clock Trees, Verilog RTL Synthesis',
        scheduledDate: 'Available Now',
        status: 'Available',
        totalParticipants: 71,
      },
    ],
  },
  {
    id: 'series_ml_deep',
    seriesCode: 'TS-AIML701-M',
    title: 'Machine Learning & Transformer Architectures Series',
    department: 'Artificial Intelligence & DS',
    semester: 'Semester 7',
    courseId: 'course_ml_ai',
    courseCode: 'AI-701',
    category: 'Technical Certification',
    description:
      'Comprehensive assessment track examining gradient descent backpropagation calculus, Convolutional Receptive Fields, and Multi-Head Scaled Dot-Product Attention math.',
    difficulty: 'Mastery',
    enrolledStudentsCount: 112,
    totalTests: 2,
    completedTestsCount: 0,
    totalMarks: 200,
    averageScorePercent: 85,
    isRegistered: false,
    benefits: [
      'Mathematical matrix calculus derivations for multi-layer backpropagation',
      'Transformer positional encoding and softmax normalization problem sets',
      'Evaluation metrics (Precision, Recall, ROC-AUC, BLEU, Perplexity)',
    ],
    targetExamDate: 'Dec 15, 2026',
    coordinator: 'Prof. K. N. Deshmukh',
    exams: [
      {
        id: 'tse_ml_1',
        title: 'Supervised Learning & Backpropagation Calculus',
        examType: 'Diagnostic Sectional',
        questionsCount: 5,
        durationMinutes: 25,
        totalMarks: 100,
        passingMarks: 50,
        testId: 'test_ml_standard',
        syllabusCoverage: 'Units 1-3: Loss Functions, Gradient Descent Variants, Regularization',
        scheduledDate: 'Available Now',
        status: 'Available',
        totalParticipants: 112,
      },
      {
        id: 'tse_ml_2',
        title: 'Higher Exam: Multi-Head Attention & Transformer Encoders',
        examType: 'GATE University Mock',
        questionsCount: 5,
        durationMinutes: 30,
        totalMarks: 100,
        passingMarks: 50,
        testId: 'test_ml_higher',
        syllabusCoverage: 'Units 4-6: Scaled Dot-Product Attention, Transformer Encoders, Pre-training',
        scheduledDate: 'Available Now',
        status: 'Available',
        totalParticipants: 98,
      },
    ],
  },
];

class TestSeriesService {
  private getSeries(): AcademicTestSeries[] {
    const raw = localStorage.getItem(STORAGE_KEY_TEST_SERIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_TEST_SERIES, JSON.stringify(INITIAL_TEST_SERIES));
      return INITIAL_TEST_SERIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_TEST_SERIES;
    }
  }

  private saveSeries(list: AcademicTestSeries[]): void {
    localStorage.setItem(STORAGE_KEY_TEST_SERIES, JSON.stringify(list));
  }

  private getEnrolledIds(): string[] {
    const raw = localStorage.getItem(STORAGE_KEY_SERIES_ENROLLMENTS);
    if (!raw) {
      const defaultEnrolled = ['series_dsa_mastery'];
      localStorage.setItem(STORAGE_KEY_SERIES_ENROLLMENTS, JSON.stringify(defaultEnrolled));
      return defaultEnrolled;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return ['series_dsa_mastery'];
    }
  }

  private saveEnrolledIds(ids: string[]): void {
    localStorage.setItem(STORAGE_KEY_SERIES_ENROLLMENTS, JSON.stringify(ids));
  }

  public async getAllSeries(filters?: {
    department?: string;
    courseId?: string;
    category?: string;
    query?: string;
    enrolledOnly?: boolean;
    sortBy?: 'date' | 'title' | 'enrolled' | 'tests';
  }): Promise<AcademicTestSeries[]> {
    let list = this.getSeries();
    const enrolledIds = this.getEnrolledIds();

    // Attach registered state
    list = list.map((s) => ({
      ...s,
      isRegistered: enrolledIds.includes(s.id),
    }));

    if (filters?.department && filters.department !== 'All' && filters.department !== 'All Departments') {
      list = list.filter((s) => s.department === filters.department);
    }

    if (filters?.courseId && filters.courseId !== 'All') {
      list = list.filter((s) => s.courseId === filters.courseId);
    }

    if (filters?.category && filters.category !== 'All') {
      list = list.filter((s) => s.category === filters.category);
    }

    if (filters?.enrolledOnly) {
      list = list.filter((s) => enrolledIds.includes(s.id));
    }

    if (filters?.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.seriesCode.toLowerCase().includes(q) ||
          s.courseCode.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q)
      );
    }

    if (filters?.sortBy === 'enrolled') {
      list.sort((a, b) => b.enrolledStudentsCount - a.enrolledStudentsCount);
    } else if (filters?.sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (filters?.sortBy === 'tests') {
      list.sort((a, b) => b.totalTests - a.totalTests);
    } else {
      // Default: date / order
    }

    return list;
  }

  public async getSeriesById(id: string): Promise<AcademicTestSeries | null> {
    const list = await this.getAllSeries();
    return list.find((s) => s.id === id) || null;
  }

  public async toggleEnrollSeries(seriesId: string): Promise<boolean> {
    const enrolledIds = this.getEnrolledIds();
    const isCurrentlyEnrolled = enrolledIds.includes(seriesId);
    let nextIds: string[];

    if (isCurrentlyEnrolled) {
      nextIds = enrolledIds.filter((id) => id !== seriesId);
    } else {
      nextIds = [...enrolledIds, seriesId];
    }
    this.saveEnrolledIds(nextIds);

    // Update count in store
    const list = this.getSeries().map((s) => {
      if (s.id === seriesId) {
        return {
          ...s,
          enrolledStudentsCount: isCurrentlyEnrolled
            ? Math.max(0, s.enrolledStudentsCount - 1)
            : s.enrolledStudentsCount + 1,
          isRegistered: !isCurrentlyEnrolled,
        };
      }
      return s;
    });
    this.saveSeries(list);

    return !isCurrentlyEnrolled;
  }
}

export const testSeriesService = new TestSeriesService();
