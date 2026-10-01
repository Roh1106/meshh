export interface SyllabusUnit {
  unitNumber: number;
  title: string;
  hours: number;
  weightagePercent: number;
  topics: string[];
  learningOutcome: string;
}

export interface DetailedCourseSyllabus {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  department: string;
  semester: string;
  credits: number;
  totalLectureHours: number;
  prerequisites: string;
  evaluationScheme: {
    inSemesterExam: number;
    endSemesterExam: number;
    termWork: number;
    practicalOral: number;
    totalMarks: number;
  };
  units: SyllabusUnit[];
  textbooks: { title: string; author: string; publisher: string; edition: string }[];
  referenceBooks: { title: string; author: string; publisher: string }[];
  practicalExercises: string[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  department: string;
  semester: string;
  credits: number;
  instructor: string;
  instructorAvatar?: string;
  description: string;
  syllabusModules: string[];
  enrolledStudentsCount: number;
  availableSeats: number;
  associatedTestsCount: number;
  prerequisites?: string;
}

export interface StudentRegistrationRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  studentDepartment: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  registeredAt: string;
  status: 'Approved' | 'Pending Review' | 'Enrolled';
}

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course_dsa',
    code: 'CS-301',
    title: 'Data Structures & Algorithms',
    department: 'Computer Science & Eng.',
    semester: 'Semester 3',
    credits: 4,
    instructor: 'Prof. S. R. Patil',
    description:
      'Rigorous analysis of asymptotic complexity, linear data structures, heaps, balanced search trees, graph algorithms, and dynamic programming.',
    syllabusModules: [
      'Asymptotic Notations & Master Theorem',
      'Non-linear Structures: AVL & Red-Black Trees',
      'Graph Traversals, Dijkstra & Kruskal',
      'Dynamic Programming & Greedy Paradigms',
    ],
    enrolledStudentsCount: 68,
    availableSeats: 80,
    associatedTestsCount: 3,
    prerequisites: 'C / C++ Programming Fundamentals',
  },
  {
    id: 'course_dbms',
    code: 'CS-402',
    title: 'Database Management Systems',
    department: 'Computer Science & Eng.',
    semester: 'Semester 4',
    credits: 4,
    instructor: 'Dr. P. B. Rao (HOD)',
    description:
      'Relational data models, canonical covers, lossless decompositions (BCNF & 3NF), relational calculus, ACID transaction management, and indexing.',
    syllabusModules: [
      'Relational Algebra & Normalization (1NF through BCNF)',
      'Transaction Processing & Concurrency Control',
      'B+ Trees & Hash Indexing',
      'Query Optimization & Execution Engines',
    ],
    enrolledStudentsCount: 74,
    availableSeats: 80,
    associatedTestsCount: 4,
    prerequisites: 'Data Structures',
  },
  {
    id: 'course_os',
    code: 'CS-403',
    title: 'Operating Systems & Kernel Architecture',
    department: 'Computer Science & Eng.',
    semester: 'Semester 4',
    credits: 4,
    instructor: 'Prof. M. S. Joshi',
    description:
      'Process scheduling algorithms, synchronization primitives (mutex, semaphores), deadlock avoidance (Banker algorithm), virtual memory paging, and file system design.',
    syllabusModules: [
      'Process Lifecycle & CPU Scheduling',
      'Concurrency, Semaphores & Deadlock Conditions',
      'Virtual Memory, TLBs & Paging',
      'File System Implementation & Disk I/O',
    ],
    enrolledStudentsCount: 65,
    availableSeats: 80,
    associatedTestsCount: 3,
    prerequisites: 'Computer Organization & Architecture',
  },
  {
    id: 'course_cn',
    code: 'IT-501',
    title: 'Computer Networks & Internet Protocols',
    department: 'Information Technology',
    semester: 'Semester 5',
    credits: 4,
    instructor: 'Prof. Anita Kulkarni',
    description:
      'Layered OSI and TCP/IP stack, CIDR subnetting, distance vector and link state routing, transport layer flow and congestion control, and network security.',
    syllabusModules: [
      'Physical & Data Link Layers: Framing, CRC, Sliding Window',
      'Network Layer: IPv4/IPv6, CIDR, OSPF, BGP',
      'Transport Layer: TCP Congestion Control & Sockets',
      'Application Protocols: HTTP/2, DNS, TLS',
    ],
    enrolledStudentsCount: 58,
    availableSeats: 70,
    associatedTestsCount: 3,
  },
  {
    id: 'course_dsp',
    code: 'EC-502',
    title: 'Digital Signal Processing',
    department: 'Electronics & Comm. (ECE)',
    semester: 'Semester 5',
    credits: 4,
    instructor: 'Prof. R. V. Deshpande',
    description:
      'Discrete-time signals and systems, Z-transforms, Discrete Fourier Transform (DFT), Fast Fourier Transform (FFT) algorithms, and FIR/IIR digital filter synthesis.',
    syllabusModules: [
      'Z-Transform Analysis & Frequency Response',
      'DFT, IDFT & Radix-2 FFT Computations',
      'FIR Filter Design via Windowing Techniques',
      'IIR Butterworth & Chebyshev Bilinear Transformations',
    ],
    enrolledStudentsCount: 52,
    availableSeats: 60,
    associatedTestsCount: 3,
    prerequisites: 'Signals and Systems',
  },
  {
    id: 'course_vlsi',
    code: 'EC-601',
    title: 'CMOS VLSI Design & Verilog HDL',
    department: 'Electronics & Comm. (ECE)',
    semester: 'Semester 6',
    credits: 4,
    instructor: 'Prof. K. N. Iyer',
    description:
      'MOS transistor theory, CMOS inverter characteristics, layout rules, combinational and sequential logic synthesis in Verilog HDL, and FPGA prototyping.',
    syllabusModules: [
      'MOS Inverter DC & Transient Switching Characteristics',
      'Static & Dynamic CMOS Logic Gates',
      'Verilog Behavioral & RTL Synthesis',
      'FPGA Placement, Routing & Timing Constraints',
    ],
    enrolledStudentsCount: 45,
    availableSeats: 60,
    associatedTestsCount: 3,
  },
  {
    id: 'course_ml',
    code: 'CS-603',
    title: 'Machine Learning & Neural Foundations',
    department: 'Computer Science & Eng.',
    semester: 'Semester 6',
    credits: 4,
    instructor: 'Dr. V. A. Shinde',
    description:
      'Supervised and unsupervised learning, linear and logistic regression, SVMs, decision trees, backpropagation in multilayer perceptrons, and hyperparameter tuning.',
    syllabusModules: [
      'Linear Models & Gradient Descent Optimization',
      'Support Vector Machines & Kernel Tricks',
      'Unsupervised Clustering: K-Means & PCA',
      'Deep Feedforward Networks & Regularization',
    ],
    enrolledStudentsCount: 78,
    availableSeats: 80,
    associatedTestsCount: 3,
  },
  {
    id: 'course_web_dev',
    code: 'IT-504',
    title: 'Modern Web Architectures & REST APIs',
    department: 'Information Technology',
    semester: 'Semester 5',
    credits: 3,
    instructor: 'Prof. T. G. More',
    description:
      'Modern client-server architectures, responsive frontend state management, RESTful API design with FastAPI/Express, offline PWA caching, and SQLite/PostgreSQL connectors.',
    syllabusModules: [
      'Modern JavaScript / TypeScript & SPA Lifecycle',
      'REST API Design, Middleware & JWT Authentication',
      'IndexedDB & Service Worker Caching Strategies',
      'Relational ORM integration & Deployment',
    ],
    enrolledStudentsCount: 62,
    availableSeats: 70,
    associatedTestsCount: 2,
  },
  {
    id: 'course_dist_sys',
    code: 'CS-701',
    title: 'Cloud Computing & Distributed Systems',
    department: 'Computer Science & Eng.',
    semester: 'Semester 7',
    credits: 4,
    instructor: 'Dr. P. B. Rao (HOD)',
    description:
      'Distributed systems models, consensus protocols (Paxos, Raft), vector clocks, CAP theorem, distributed storage (Dynamo, Spanner), and microservice orchestration.',
    syllabusModules: [
      'Logical Clocks, Snapshotting & Total Ordering',
      'Consensus Algorithms: 2PC, Paxos & Raft',
      'CAP Theorem, PACELC & Eventual Consistency',
      'Containerization, Kubernetes & Distributed Tracing',
    ],
    enrolledStudentsCount: 48,
    availableSeats: 65,
    associatedTestsCount: 3,
    prerequisites: 'Operating Systems & Computer Networks',
  },
  {
    id: 'course_cyber_sec',
    code: 'IT-602',
    title: 'Cyber Security & Cryptographic Protocols',
    department: 'Information Technology',
    semester: 'Semester 6',
    credits: 4,
    instructor: 'Prof. Anita Kulkarni',
    description:
      'Mathematical cryptography (RSA, Elliptic Curves, AES), hash message authentication codes, public key infrastructure (PKI), TLS 1.3 handshake, zero-trust network defenses, and penetration testing.',
    syllabusModules: [
      'Number Theory & Asymmetric Cryptosystems (RSA, ECC)',
      'Cryptographic Hash Functions (SHA-256) & HMAC',
      'Key Exchange Protocols (Diffie-Hellman) & TLS 1.3',
      'Web Security Invariants: XSS, CSRF & SQL Injection Mitigation',
    ],
    enrolledStudentsCount: 54,
    availableSeats: 65,
    associatedTestsCount: 3,
    prerequisites: 'Computer Networks',
  },
  {
    id: 'course_embedded',
    code: 'EE-405',
    title: 'Embedded Systems & IoT Architectures',
    department: 'Electronics & Comm. (ECE)',
    semester: 'Semester 5',
    credits: 4,
    instructor: 'Prof. R. V. Deshpande',
    description:
      'ARM Cortex-M microcontroller programming, real-time operating systems (FreeRTOS), peripheral interfaces (UART, SPI, I2C, CAN), low-power sensors, and MQTT/CoAP telemetry.',
    syllabusModules: [
      'ARM Cortex-M Architecture & NVIC Interrupt Handling',
      'Serial Communication Buses: SPI, I2C & CAN Bus',
      'FreeRTOS Task Scheduling, Queues & Priority Inversion',
      'IoT Edge Telemetry: MQTT Protocols & Power Optimization',
    ],
    enrolledStudentsCount: 42,
    availableSeats: 60,
    associatedTestsCount: 3,
    prerequisites: 'Digital Logic & C Programming',
  },
  {
    id: 'course_ai',
    code: 'CS-705',
    title: 'Artificial Intelligence & Autonomous Agents',
    department: 'Computer Science & Eng.',
    semester: 'Semester 7',
    credits: 4,
    instructor: 'Dr. V. A. Shinde',
    description:
      'State-space search (A*, Minimax with Alpha-Beta pruning), constraint satisfaction problems, probabilistic reasoning (Bayesian networks), Markov decision processes, and reinforcement learning.',
    syllabusModules: [
      'Heuristic Search & Adversarial Game Trees',
      'Probabilistic Reasoning & Hidden Markov Models',
      'Markov Decision Processes & Bellman Equations',
      'Q-Learning, Policy Gradients & Multi-Agent Coordination',
    ],
    enrolledStudentsCount: 57,
    availableSeats: 70,
    associatedTestsCount: 2,
    prerequisites: 'Algorithms & Discrete Mathematics',
  },
];

export const INITIAL_REGISTRATIONS: StudentRegistrationRecord[] = [
  {
    id: 'reg_1',
    studentId: 'usr_rohan_ranmale',
    studentName: 'Rohan Ranmale',
    studentRoll: 'BV-22CS084',
    studentDepartment: 'Computer Science & Eng.',
    courseId: 'course_dsa',
    courseCode: 'CS-301',
    courseTitle: 'Data Structures & Algorithms',
    registeredAt: 'Aug 14, 2026',
    status: 'Enrolled',
  },
  {
    id: 'reg_2',
    studentId: 'usr_rohan_ranmale',
    studentName: 'Rohan Ranmale',
    studentRoll: 'BV-22CS084',
    studentDepartment: 'Computer Science & Eng.',
    courseId: 'course_dbms',
    courseCode: 'CS-402',
    courseTitle: 'Database Management Systems',
    registeredAt: 'Aug 14, 2026',
    status: 'Enrolled',
  },
  {
    id: 'reg_3',
    studentId: 'usr_rohan_ranmale',
    studentName: 'Rohan Ranmale',
    studentRoll: 'BV-22CS084',
    studentDepartment: 'Computer Science & Eng.',
    courseId: 'course_os',
    courseCode: 'CS-403',
    courseTitle: 'Operating Systems & Kernel Architecture',
    registeredAt: 'Aug 15, 2026',
    status: 'Enrolled',
  },
  {
    id: 'reg_4',
    studentId: 'usr_neha_gupta',
    studentName: 'Neha Gupta',
    studentRoll: 'BV-22EC012',
    studentDepartment: 'Electronics & Comm. (ECE)',
    courseId: 'course_dsp',
    courseCode: 'EC-502',
    courseTitle: 'Digital Signal Processing',
    registeredAt: 'Aug 18, 2026',
    status: 'Enrolled',
  },
  {
    id: 'reg_5',
    studentId: 'usr_neha_gupta',
    studentName: 'Neha Gupta',
    studentRoll: 'BV-22EC012',
    studentDepartment: 'Electronics & Comm. (ECE)',
    courseId: 'course_vlsi',
    courseCode: 'EC-601',
    courseTitle: 'CMOS VLSI Design & Verilog HDL',
    registeredAt: 'Aug 18, 2026',
    status: 'Enrolled',
  },
  {
    id: 'reg_6',
    studentId: 'usr_ananya_iyer',
    studentName: 'Ananya Iyer',
    studentRoll: 'BV-23IT029',
    studentDepartment: 'Information Technology',
    courseId: 'course_cn',
    courseCode: 'IT-501',
    courseTitle: 'Computer Networks & Internet Protocols',
    registeredAt: 'Aug 19, 2026',
    status: 'Enrolled',
  },
  {
    id: 'reg_7',
    studentId: 'usr_ananya_iyer',
    studentName: 'Ananya Iyer',
    studentRoll: 'BV-23IT029',
    studentDepartment: 'Information Technology',
    courseId: 'course_cyber_sec',
    courseCode: 'IT-602',
    courseTitle: 'Cyber Security & Cryptographic Protocols',
    registeredAt: 'Aug 19, 2026',
    status: 'Enrolled',
  },
  {
    id: 'reg_8',
    studentId: 'usr_pranav_d',
    studentName: 'Pranav Deshmukh',
    studentRoll: 'BV-22ME018',
    studentDepartment: 'Mechanical Engineering',
    courseId: 'course_embedded',
    courseCode: 'EE-405',
    courseTitle: 'Embedded Systems & IoT Architectures',
    registeredAt: 'Aug 20, 2026',
    status: 'Enrolled',
  },
];

class CourseService {
  private courses: Course[] = [...INITIAL_COURSES];
  private registrations: StudentRegistrationRecord[] = [...INITIAL_REGISTRATIONS];

  async getCourses(params?: { department?: string; query?: string }): Promise<Course[]> {
    await new Promise((r) => setTimeout(r, 60));
    return this.courses.filter((c) => {
      if (params?.department && params.department !== 'All Departments') {
        if (!c.department.toLowerCase().includes(params.department.toLowerCase())) {
          return false;
        }
      }
      if (params?.query) {
        const q = params.query.toLowerCase();
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchCode = c.code.toLowerCase().includes(q);
        const matchDept = c.department.toLowerCase().includes(q);
        if (!matchTitle && !matchCode && !matchDept) return false;
      }
      return true;
    });
  }

  async getCourseById(id: string): Promise<Course | undefined> {
    await new Promise((r) => setTimeout(r, 40));
    return this.courses.find((c) => c.id === id);
  }

  async addCourse(newCourse: Omit<Course, 'enrolledStudentsCount'> & { enrolledStudentsCount?: number }): Promise<Course> {
    await new Promise((r) => setTimeout(r, 80));
    const course: Course = {
      ...newCourse,
      enrolledStudentsCount: newCourse.enrolledStudentsCount || 0,
    };
    this.courses.unshift(course);
    return course;
  }

  async registerStudentForCourse(
    student: { id: string; name: string; rollNo?: string; department: string },
    course: Course
  ): Promise<StudentRegistrationRecord> {
    await new Promise((r) => setTimeout(r, 100));

    // check if already registered
    const existing = this.registrations.find(
      (reg) => reg.studentId === student.id && reg.courseId === course.id
    );
    if (existing) {
      return existing;
    }

    const newRecord: StudentRegistrationRecord = {
      id: `reg_${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      studentRoll: student.rollNo || 'BV-STUDENT',
      studentDepartment: student.department,
      courseId: course.id,
      courseCode: course.code,
      courseTitle: course.title,
      registeredAt: 'Just now',
      status: 'Enrolled',
    };

    this.registrations.unshift(newRecord);

    // update course seats
    const targetCourse = this.courses.find((c) => c.id === course.id);
    if (targetCourse) {
      targetCourse.enrolledStudentsCount += 1;
    }

    return newRecord;
  }

  async unregisterStudentFromCourse(studentId: string, courseId: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 80));
    const initialLen = this.registrations.length;
    this.registrations = this.registrations.filter(
      (r) => !(r.studentId === studentId && r.courseId === courseId)
    );
    if (this.registrations.length < initialLen) {
      const targetCourse = this.courses.find((c) => c.id === courseId);
      if (targetCourse && targetCourse.enrolledStudentsCount > 0) {
        targetCourse.enrolledStudentsCount -= 1;
      }
      return true;
    }
    return false;
  }

  async getAllRegistrations(): Promise<StudentRegistrationRecord[]> {
    await new Promise((r) => setTimeout(r, 60));
    return [...this.registrations];
  }

  async getCourseSyllabus(courseId: string): Promise<DetailedCourseSyllabus> {
    await new Promise((r) => setTimeout(r, 40));
    const course = this.courses.find((c) => c.id === courseId) || this.courses[0];

    // Customized syllabi for major subjects
    if (course.code === 'CS-301') {
      return {
        courseId: course.id,
        courseCode: course.code,
        courseTitle: course.title,
        department: course.department,
        semester: course.semester,
        credits: course.credits,
        totalLectureHours: 48,
        prerequisites: 'CS-102 Programming & Problem Solving (C/C++)',
        evaluationScheme: {
          inSemesterExam: 30,
          endSemesterExam: 70,
          termWork: 25,
          practicalOral: 25,
          totalMarks: 150,
        },
        units: [
          {
            unitNumber: 1,
            title: 'Asymptotic Complexity & Recurrence Analysis',
            hours: 8,
            weightagePercent: 15,
            topics: [
              'Big-O, Omega, Theta notations and formal mathematical limits',
              'Master Theorem cases 1, 2, 3 and Akra-Bazzi method',
              'Amortized analysis: Aggregate, Accounting, and Potential method',
              'Space-time trade-off in cache-friendly array layouts',
            ],
            learningOutcome: 'Formulate and prove mathematical bounds for recursive and iterative algorithms.',
          },
          {
            unitNumber: 2,
            title: 'Linear & Hierarchical Non-Linear Data Structures',
            hours: 8,
            weightagePercent: 18,
            topics: [
              'Self-balancing Search Trees: AVL Tree rotations and height proofs',
              'Red-Black Trees: Invariants, recoloring, and rotation cases',
              'B-Trees and B+ Trees: Internal node splits and disk block sizing',
              'Skip Lists: Probabilistic balancing and concurrent search',
            ],
            learningOutcome: 'Design logarithmic worst-case search and insert data structures.',
          },
          {
            unitNumber: 3,
            title: 'Priority Queues & Disjoint-Set Forest',
            hours: 7,
            weightagePercent: 15,
            topics: [
              'Binary Heaps, Binomial Heaps, and Fibonacci Heaps',
              'Decrease-Key operation and amortized constant-time bounds',
              'Disjoint-Set Union (DSU) with Path Compression and Union by Rank',
              'Ackermann inverse function α(n) complexity proofs',
            ],
            learningOutcome: 'Implement fast mergeable priority queues and connected-component queries.',
          },
          {
            unitNumber: 4,
            title: 'Graph Algorithms & Shortest Path Paradigms',
            hours: 9,
            weightagePercent: 20,
            topics: [
              'Graph Representations: Adjacency list, matrix, forward star',
              'DFS, BFS, Topological Sort, Strongly Connected Components (Tarjan & Kosaraju)',
              'Minimum Spanning Trees: Kruskal with DSU vs Prim with Fibonacci Heap',
              'Shortest Paths: Dijkstra, Bellman-Ford (negative cycles), and Floyd-Warshall',
            ],
            learningOutcome: 'Apply graph optimization techniques to large-scale network routing problems.',
          },
          {
            unitNumber: 5,
            title: 'Dynamic Programming & Greedy Invariants',
            hours: 9,
            weightagePercent: 18,
            topics: [
              'Optimal substructure and overlapping subproblems properties',
              'Matrix Chain Multiplication, 0/1 Knapsack, Longest Common Subsequence',
              'DP on Trees and Bitmask Dynamic Programming',
              'Greedy choice property: Huffman Coding, Fractional Knapsack, Activity Selection',
            ],
            learningOutcome: 'Formulate memoized state transitions and identify matroids for greedy choices.',
          },
          {
            unitNumber: 6,
            title: 'Advanced String Matching & Tractability',
            hours: 7,
            weightagePercent: 14,
            topics: [
              'Knuth-Morris-Pratt (KMP) failure function calculation',
              'Rabin-Karp Rolling Hash and Z-Algorithm',
              'Trie, Suffix Array, and Burrows-Wheeler Transform foundations',
              'Introduction to P, NP, NP-Complete (3-SAT, Clique, Hamiltonian Cycle reductions)',
            ],
            learningOutcome: 'Analyze linear-time string search and classify computationally hard problems.',
          },
        ],
        textbooks: [
          {
            title: 'Introduction to Algorithms (CLRS)',
            author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
            publisher: 'MIT Press / McGraw-Hill',
            edition: '4th Edition, 2022',
          },
          {
            title: 'Algorithms',
            author: 'Robert Sedgewick and Kevin Wayne',
            publisher: 'Addison-Wesley Professional',
            edition: '4th Edition, 2021',
          },
        ],
        referenceBooks: [
          {
            title: 'The Design and Analysis of Computer Algorithms',
            author: 'Alfred V. Aho, John E. Hopcroft, Jeffrey D. Ullman',
            publisher: 'Pearson Education',
          },
          {
            title: 'Fundamentals of Computer Algorithms',
            author: 'Ellis Horowitz, Sartaj Sahni, Sanguthevar Rajasekaran',
            publisher: 'Universities Press',
          },
        ],
        practicalExercises: [
          'Implementation and benchmark of AVL Tree vs Skip List under 1,000,000 operations.',
          'Dijkstra Shortest Path engine with Fibonacci Heap priority queue in C++.',
          'Dynamic Programming Matrix Chain Multiplication with optimal parentheses reconstruction.',
          'Kosaraju Strongly Connected Components decomposition of campus web crawler graph.',
          'KMP pattern search comparison against Naive string matching with cache profiling.',
        ],
      };
    }

    if (course.code === 'CS-402') {
      return {
        courseId: course.id,
        courseCode: course.code,
        courseTitle: course.title,
        department: course.department,
        semester: course.semester,
        credits: course.credits,
        totalLectureHours: 48,
        prerequisites: 'CS-301 Data Structures & Algorithms',
        evaluationScheme: {
          inSemesterExam: 30,
          endSemesterExam: 70,
          termWork: 25,
          practicalOral: 25,
          totalMarks: 150,
        },
        units: [
          {
            unitNumber: 1,
            title: 'Data Modeling & Relational Algebra Foundation',
            hours: 8,
            weightagePercent: 15,
            topics: [
              'Database system architecture: ANSI-SPARC 3-tier view model',
              'Extended Entity-Relationship (EER) modeling: Specialization, generalization',
              'Relational algebra operators: Selection, projection, joins, division',
              'Tuple relational calculus (TRC) and domain relational calculus (DRC) safety',
            ],
            learningOutcome: 'Construct declarative query expressions and translate ER diagrams into relational schemas.',
          },
          {
            unitNumber: 2,
            title: 'Functional Dependencies & Normalization Theory',
            hours: 9,
            weightagePercent: 20,
            topics: [
              'Armstrong axioms, attribute closures, and minimal canonical covers',
              'Normal forms: 1NF, 2NF, 3NF, Boyce-Codd Normal Form (BCNF)',
              'Lossless-join decomposition theorem and dependency preservation tests',
              'Higher normal forms: 4NF (multivalued dependencies), 5NF (project-join)',
            ],
            learningOutcome: 'Synthesize optimal, anomaly-free relational database designs.',
          },
          {
            unitNumber: 3,
            title: 'Transaction Concurrency & Isolation Levels',
            hours: 9,
            weightagePercent: 20,
            topics: [
              'ACID properties and schedule serializability (Conflict and View serializability)',
              'Two-Phase Locking (2PL): Conservative, strict, and rigorous variations',
              'Deadlock handling: Wait-for graphs, wait-die and wound-wait schemes',
              'Multi-Version Concurrency Control (MVCC) and Snapshot Isolation anomalies',
            ],
            learningOutcome: 'Guarantee transaction isolation without introducing deadlock cascades.',
          },
          {
            unitNumber: 4,
            title: 'Storage Architectures, B+ Trees & Hashing',
            hours: 8,
            weightagePercent: 16,
            topics: [
              'Storage hierarchy, page layout (slotted page), and buffer pool replacement (LRU-K)',
              'Dense and sparse indices, primary vs secondary clustered storage',
              'B+ Tree index operations: Insertion splits, underflow rebalancing, node capacity',
              'Extendible hashing and linear hashing algorithms for dynamic datasets',
            ],
            learningOutcome: 'Design high-throughput disk and memory index structures.',
          },
          {
            unitNumber: 5,
            title: 'Query Processing, Cost Models & Optimization',
            hours: 8,
            weightagePercent: 15,
            topics: [
              'Query execution pipeline: Parsing, semantic check, logical query tree',
              'Relational equivalence transformation rules for cost optimization',
              'Join algorithms: Block nested loop, indexed nested loop, sort-merge, hash join',
              'Cost estimation: Histogram stats, selectivity factors, catalog metadata',
            ],
            learningOutcome: 'Analyze EXPLAIN query execution plans and optimize complex joins.',
          },
          {
            unitNumber: 6,
            title: 'Crash Recovery (ARIES) & Distributed Architectures',
            hours: 6,
            weightagePercent: 14,
            topics: [
              'Failure classification, write-ahead logging (WAL), and steal/no-force buffer policies',
              'ARIES recovery algorithm: Analysis pass, Redo pass, Undo pass with CLRs',
              'Checkpoints: Non-quiescent fuzzy checkpointing mechanisms',
              'Distributed databases: Two-Phase Commit (2PC), Paxos/Raft consensus overview',
            ],
            learningOutcome: 'Implement atomic crash-resilient storage engines with deterministic recovery.',
          },
        ],
        textbooks: [
          {
            title: 'Database System Concepts',
            author: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan',
            publisher: 'McGraw-Hill Education',
            edition: '7th Edition, 2021',
          },
          {
            title: 'Database Management Systems',
            author: 'Raghu Ramakrishnan and Johannes Gehrke',
            publisher: 'McGraw-Hill Science',
            edition: '3rd Edition, 2020',
          },
        ],
        referenceBooks: [
          {
            title: 'Fundamentals of Database Systems',
            author: 'Ramez Elmasri and Shamkant B. Navathe',
            publisher: 'Pearson Education',
          },
          {
            title: 'Principles of Transaction Processing',
            author: 'Philip A. Bernstein and Eric Newcomer',
            publisher: 'Morgan Kaufmann',
          },
        ],
        practicalExercises: [
          'Design and implementation of normalized university registrar database in PostgreSQL.',
          'Implementation of B+ Tree page split and search operations in C++ / Java.',
          'Transaction concurrency stress testing and dirty read reproduction under Read Committed vs Serializable.',
          'Query optimization lab: Profiling Hash Join vs Sort-Merge Join on 500,000 tuples using EXPLAIN ANALYZE.',
          'Crash recovery simulation: WAL log replay engine implementing ARIES redo and undo passes.',
        ],
      };
    }

    // Default rich syllabus template for other courses
    return {
      courseId: course.id,
      courseCode: course.code,
      courseTitle: course.title,
      department: course.department,
      semester: course.semester,
      credits: course.credits,
      totalLectureHours: 46,
      prerequisites: course.prerequisites || 'Departmental Core Prerequisites',
      evaluationScheme: {
        inSemesterExam: 30,
        endSemesterExam: 70,
        termWork: 25,
        practicalOral: 25,
        totalMarks: 150,
      },
      units: [
        {
          unitNumber: 1,
          title: 'Foundations & Mathematical Principles',
          hours: 8,
          weightagePercent: 16,
          topics: [
            `${course.title} theoretical foundations and core formalisms`,
            'Fundamental mathematical modeling and system taxonomy',
            'Analytical metrics, baseline requirements, and standard benchmarks',
            'Contemporary industry landscape and compliance constraints',
          ],
          learningOutcome: 'Establish core domain principles and evaluate systemic requirements.',
        },
        {
          unitNumber: 2,
          title: 'Architecture & Core Mechanics',
          hours: 8,
          weightagePercent: 18,
          topics: [
            `Core architectural layers of ${course.code}`,
            'Data representations, internal invariants, and state management',
            'Structural design patterns and component composition',
            'Error containment and boundary condition handling',
          ],
          learningOutcome: 'Architect robust subsystems conforming to modern engineering standards.',
        },
        {
          unitNumber: 3,
          title: 'Algorithmic Optimization & Protocols',
          hours: 8,
          weightagePercent: 18,
          topics: [
            'Asymptotic and operational throughput optimization',
            'Distributed protocols, synchronization, and event coordination',
            'Resource management, caching, and hardware efficiency',
            'Comparative analysis of alternative algorithm implementations',
          ],
          learningOutcome: 'Analyze and benchmark critical performance bottlenecks.',
        },
        {
          unitNumber: 4,
          title: 'System Integration & Practical Implementation',
          hours: 8,
          weightagePercent: 18,
          topics: [
            'API design, serialization, and inter-process communication',
            'Tooling ecosystems, build pipelines, and automated test runners',
            'Hardware/software boundary considerations and firmware interfaces',
            'Resilience patterns, graceful degradation, and health telemetry',
          ],
          learningOutcome: 'Build production-ready modules with comprehensive integration test suites.',
        },
        {
          unitNumber: 5,
          title: 'Security, Verification & Validation',
          hours: 7,
          weightagePercent: 15,
          topics: [
            'Threat modeling, attack surfaces, and defensive design',
            'Static analysis, formal verification, and automated assertions',
            'Fault injection testing and disaster recovery simulations',
            'Verification against IEEE and ISO regulatory standards',
          ],
          learningOutcome: 'Certify system security posture and verify operational invariants.',
        },
        {
          unitNumber: 6,
          title: 'Contemporary Research & Emerging Trends',
          hours: 7,
          weightagePercent: 15,
          topics: [
            `Modern real-world case studies in ${course.title}`,
            'Next-generation specifications and academic research frontiers',
            'Cloud-native and distributed edge deployment patterns',
            'Capstone project design criteria and evaluation rubric',
          ],
          learningOutcome: 'Synthesize contemporary developments into extensible capstone architectures.',
        },
      ],
      textbooks: [
        {
          title: `${course.title}: Engineering Principles & Applications`,
          author: `${course.instructor} et al.`,
          publisher: 'Academic Press / Pearson Education',
          edition: 'Latest Edition, 2024',
        },
      ],
      referenceBooks: [
        {
          title: `Advanced ${course.title} Handbook`,
          author: 'IEEE Computer Society Educational Board',
          publisher: 'Wiley-IEEE Press',
        },
      ],
      practicalExercises: [
        `Benchmarking and profiling laboratory for ${course.title}.`,
        'End-to-end subsystem implementation with continuous integration.',
        'Diagnostic verification of system invariants under heavy load.',
      ],
    };
  }
}

export const courseService = new CourseService();

