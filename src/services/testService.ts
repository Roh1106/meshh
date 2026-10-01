import { PracticeTest, TestFreeResource } from '../types';

export const INITIAL_TESTS: PracticeTest[] = [
  // ==========================================
  // 1. DATA STRUCTURES & ALGORITHMS (CS-301)
  // ==========================================
  {
    id: 'test_dsa_trees_graphs',
    title: 'Data Structures: Balanced Trees & Graph Traversals',
    subject: 'Data Structures & Algorithms',
    courseId: 'course_dsa',
    department: 'Computer Science & Eng.',
    questionsCount: 5,
    durationMinutes: 20,
    difficulty: 'Intermediate',
    semester: 'Semester 3',
    attemptsCount: 168,
    highScorePercentage: 94,
    lastAttemptScore: 80,
    isAvailableOffline: true,
    freelyAvailableResources: [
      {
        id: 'fr_dsa_1',
        title: 'AVL & Red-Black Tree Rotation Summary Sheet',
        type: 'Formula Sheet',
        size: '1.2 MB',
        description: 'Complete visual walkthrough of Single (LL, RR) and Double (LR, RL) rotations with re-balancing invariants and balance factor proofs.',
        authorOrSource: 'Prof. S. R. Patil · BVCOE Dept of Computer Science',
      },
      {
        id: 'fr_dsa_2',
        title: 'Open Textbook: Graph Algorithms & Minimum Spanning Trees',
        type: 'Open Textbook',
        size: '4.8 MB',
        description: 'Open-access comprehensive chapter on Dijkstra, Bellman-Ford, Kruskal, and Prim algorithms with C++ STL implementations.',
        authorOrSource: 'Academic Open Press & BVCOE Study Hall',
      },
      {
        id: 'fr_dsa_3',
        title: 'PYQ Archive: University Exam Questions with Step-by-Step Solutions',
        type: 'PDF Guide',
        size: '2.3 MB',
        description: 'Past 5 years BVCOE semester question papers covering graph traversals, topological sorting, and heap sort proofs.',
        authorOrSource: 'BVCOE Academic Archive',
      },
    ],
    questions: [
      {
        id: 'dq1',
        prompt: 'What is the maximum height difference (balance factor) allowed between left and right subtrees in any node of an AVL tree?',
        options: ['At most 1', 'At most 2', 'At most 0 (must be identical)', 'No limit as long as binary search property holds'],
        correctIndex: 0,
        explanation: 'By definition, an AVL tree requires the balance factor of every node (height of left subtree minus height of right subtree) to be either -1, 0, or 1.',
      },
      {
        id: 'dq2',
        prompt: 'Which graph traversal algorithm uses a FIFO Queue and is guaranteed to find the shortest path in an unweighted graph?',
        options: ['Depth First Search (DFS)', 'Breadth First Search (BFS)', 'Topological Sort', 'Tarjan SCC Algorithm'],
        correctIndex: 1,
        explanation: 'BFS explores vertices level by level using a queue, guaranteeing the minimum edge count path between source and destination in unweighted graphs.',
      },
      {
        id: 'dq3',
        prompt: 'What is the tight worst-case time complexity of Kruskal’s Minimum Spanning Tree algorithm using Disjoint Set Union (Union-Find with path compression)?',
        options: ['O(V^2)', 'O(E log E) or O(E log V)', 'O(V + E)', 'O(E^2)'],
        correctIndex: 1,
        explanation: 'Sorting the edges takes O(E log E). The union-find operations take O(E * α(V)), which is practically linear, so edge sorting dominates giving O(E log V).',
      },
    ],
  },
  {
    id: 'test_dsa_mastery_higher',
    title: 'Advanced DSA Mastery: Dynamic Programming & Amortized Complexity',
    subject: 'Data Structures & Algorithms',
    courseId: 'course_dsa',
    department: 'Computer Science & Eng.',
    questionsCount: 6,
    durationMinutes: 30,
    difficulty: 'Higher / Mastery',
    isHigherTest: true,
    semester: 'Semester 3',
    attemptsCount: 84,
    highScorePercentage: 88,
    isAvailableOffline: true,
    freelyAvailableResources: [
      {
        id: 'fr_dsa_higher_1',
        title: 'Master Theorem & Recurrence Relations Reference Guide',
        type: 'Cheat Sheet',
        size: '980 KB',
        description: 'Complete breakdown of Master Theorem cases 1, 2, and 3 with non-polynomial boundary proofs and Akra-Bazzi method for irregular splits.',
        authorOrSource: 'BVCOE Algorithms Study Hall',
      },
      {
        id: 'fr_dsa_higher_2',
        title: 'Dynamic Programming State Reduction & Bitmasking Notes',
        type: 'Lecture Notes',
        size: '2.1 MB',
        description: 'Rigorous notes on traveling salesperson DP, matrix chain multiplication, and digit DP state representation.',
        authorOrSource: 'Aarav Sharma (ACM Chapter Lead) · BVCOE Peer Tutor',
      },
      {
        id: 'fr_dsa_higher_3',
        title: 'GATE Computer Science Advanced Algorithms Practice Problem Set',
        type: 'PDF Guide',
        size: '3.4 MB',
        description: '120 higher-order conceptual problems with full mathematical derivations and amortized cost proofs.',
        authorOrSource: 'National GATE Advisory Council',
      },
    ],
    questions: [
      {
        id: 'hdq1',
        prompt: 'Given the recurrence T(n) = 3T(n/4) + n log n. Which case of the Master Theorem applies and what is the asymptotic solution?',
        options: [
          'Case 1: Θ(n^log_4(3))',
          'Case 3: Θ(n log n)',
          'Case 2: Θ(n log^2 n)',
          'Master theorem does not apply because of non-polynomial factor',
        ],
        correctIndex: 1,
        explanation: 'Here a = 3, b = 4, so n^(log_4(3)) ≈ n^0.793. Since f(n) = n log n = Ω(n^(0.793 + ε)) for ε ≈ 0.2, and the regularity condition 3*(n/4) log(n/4) <= c * n log n holds for c = 3/4 < 1, Case 3 applies: T(n) = Θ(n log n).',
      },
      {
        id: 'hdq2',
        prompt: 'In amortized analysis of a dynamic array that doubles its size when full, what is the amortized cost per append operation using the accounting (banker) method?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(1/n)'],
        correctIndex: 0,
        explanation: 'Each append charges $3: $1 for insertion, $1 to move the new element when the array doubles, and $1 to move an older element that hasn\'t paid for its move. Hence amortized cost is strictly O(1).',
      },
    ],
  },

  // ==========================================
  // 2. DATABASE MANAGEMENT SYSTEMS (CS-402)
  // ==========================================
  {
    id: 'test_dbms_norm',
    title: 'Relational Database Normalization & Canonical Covers',
    subject: 'Database Management Systems',
    courseId: 'course_dbms',
    department: 'Computer Science & Eng.',
    questionsCount: 5,
    durationMinutes: 15,
    difficulty: 'Intermediate',
    semester: 'Semester 4',
    attemptsCount: 198,
    highScorePercentage: 92,
    lastAttemptScore: 85,
    isAvailableOffline: true,
    freelyAvailableResources: [
      {
        id: 'fr_dbms_1',
        title: 'Database Systems: Normalized ER Cheat Sheet (Prof. Rao Approved)',
        type: 'Cheat Sheet',
        size: '1.8 MB',
        description: 'Complete quick-reference for BCNF, 3NF, functional dependencies, canonical covers, and relational calculus.',
        authorOrSource: 'Dr. P. B. Rao (HOD) · BVCOE Dept of Computer Science',
      },
      {
        id: 'fr_dbms_2',
        title: 'SQL DDL/DML & Relational Algebra Quick Reference',
        type: 'PDF Guide',
        size: '1.4 MB',
        description: 'Relational algebra operators (sigma, pi, rho, natural join) paired with ANSI SQL queries and execution plans.',
        authorOrSource: 'BVCOE Database Lab',
      },
    ],
    questions: [
      {
        id: 'tq1',
        prompt: 'Given relation R(A, B, C, D) with FDs: {A -> B, B -> C, C -> D, D -> A}. What are the candidate keys of R?',
        options: ['Only A', 'Only A and B', 'A, B, C, and D are all individual candidate keys', 'Only {A, B, C, D} together'],
        correctIndex: 2,
        explanation: 'Because the FDs form a cycle (A -> B -> C -> D -> A), the closure of any single attribute {A}+, {B}+, {C}+, or {D}+ contains all four attributes. Hence each is an individual minimal superkey.',
      },
      {
        id: 'tq2',
        prompt: 'In Boyce-Codd Normal Form (BCNF), for every non-trivial functional dependency X -> Y:',
        options: [
          'X must be a superkey',
          'Y must be a prime attribute',
          'X can be any subset of candidate key',
          'No transitive dependency can exist on non-prime attributes',
        ],
        correctIndex: 0,
        explanation: 'BCNF strictly requires that for every non-trivial dependency X -> Y, X must be a superkey. Unlike 3NF, BCNF does not allow the alternative condition where Y is a prime attribute.',
      },
    ],
  },
  {
    id: 'test_dbms_mastery_higher',
    title: 'DBMS Higher Exam: Transaction Serializability, 2PL & ARIES Recovery',
    subject: 'Database Management Systems',
    courseId: 'course_dbms',
    department: 'Computer Science & Eng.',
    questionsCount: 6,
    durationMinutes: 30,
    difficulty: 'Higher / Mastery',
    isHigherTest: true,
    semester: 'Semester 4',
    attemptsCount: 72,
    highScorePercentage: 86,
    isAvailableOffline: true,
    freelyAvailableResources: [
      {
        id: 'fr_dbms_high_1',
        title: 'Conflict & View Serializability Precedence Graph Notes',
        type: 'Lecture Notes',
        size: '2.4 MB',
        description: 'Detailed topological sorting of precedence graphs and testing for blind writes in view equivalence.',
        authorOrSource: 'Dr. P. B. Rao · BVCOE Faculty',
      },
      {
        id: 'fr_dbms_high_2',
        title: 'ARIES Recovery Algorithm (Analysis, Redo, Undo) Walkthrough',
        type: 'PDF Guide',
        size: '1.9 MB',
        description: 'Complete analysis of write-ahead logging (WAL), dirty page tables, and compensation log records (CLRs).',
        authorOrSource: 'BVCOE Advanced Systems Lab',
      },
    ],
    questions: [
      {
        id: 'htq1',
        prompt: 'Under Strict Two-Phase Locking (Strict 2PL), when are exclusive (write) locks released by a transaction?',
        options: [
          'Immediately after the write statement finishes',
          'During the shrinking phase before commit',
          'Only after the transaction explicitly commits or aborts',
          'Whenever another transaction requests a shared lock',
        ],
        correctIndex: 2,
        explanation: 'Strict 2PL prevents cascading rollbacks (cascadeless schedule) by holding all exclusive locks until the transaction explicitly commits or terminates.',
      },
      {
        id: 'htq2',
        prompt: 'In the ARIES recovery algorithm, which phase repeats history by re-executing all logged operations starting from the oldest uncheckpointed dirty page?',
        options: ['Analysis Phase', 'Redo Phase', 'Undo Phase', 'Checkpoint Flush Phase'],
        correctIndex: 1,
        explanation: 'ARIES follows "repeating history": the Redo phase redoes all logged changes (even those for failed transactions) from the smallest recLSN in the Dirty Page Table up to the crash point.',
      },
    ],
  },

  // ==========================================
  // 3. OPERATING SYSTEMS (CS-403)
  // ==========================================
  {
    id: 'test_os_concurrency',
    title: 'Operating Systems: Mutex, Semaphores & Deadlock Detection',
    subject: 'Operating Systems',
    courseId: 'course_os',
    department: 'Computer Science & Eng.',
    questionsCount: 5,
    durationMinutes: 15,
    difficulty: 'Intermediate',
    semester: 'Semester 4',
    attemptsCount: 145,
    highScorePercentage: 90,
    isAvailableOffline: true,
    freelyAvailableResources: [
      {
        id: 'fr_os_1',
        title: 'Operating Systems CPU Scheduling & Deadlock Avoidance Guide',
        type: 'PDF Guide',
        size: '2.4 MB',
        description: 'Gantt chart calculations for Round Robin, Shortest Job First, and Banker algorithm safety matrices.',
        authorOrSource: 'Prof. M. S. Joshi · BVCOE OS Courseware',
      },
      {
        id: 'fr_os_2',
        title: 'POSIX Thread Synchronization & Mutex Code Patterns',
        type: 'Lecture Notes',
        size: '1.1 MB',
        description: 'pthread_mutex_t and sem_t implementations with producer-consumer solutions.',
        authorOrSource: 'BVCOE Linux Lab',
      },
    ],
    questions: [
      {
        id: 'oq1',
        prompt: 'Which of the following is NOT one of the four Coffman conditions necessary for deadlock to arise?',
        options: ['Mutual exclusion', 'Hold and wait', 'Preemption enabled by kernel', 'Circular wait'],
        correctIndex: 2,
        explanation: 'The Coffman condition is NO preemption (resources cannot be forcefully taken away). Having preemption active prevents deadlocks.',
      },
      {
        id: 'oq2',
        prompt: 'In Banker’s Algorithm for deadlock avoidance, a system state is considered "safe" if:',
        options: [
          'No processes are currently holding resources',
          'There exists at least one safe sequence in which all processes can finish without deadlock',
          'The available resource vector is greater than the total resource allocation vector',
          'All semaphores have non-zero value',
        ],
        correctIndex: 1,
        explanation: 'A state is safe if there exists a sequence <P1, P2, ... Pn> such that for each Pi, the resources that Pi can still request can be satisfied by currently available resources plus resources held by all Pj (j < i).',
      },
    ],
  },
  {
    id: 'test_os_mastery_higher',
    title: 'OS Higher Exam: Kernel Virtual Memory, Inverted Page Tables & TLB Shootdowns',
    subject: 'Operating Systems',
    courseId: 'course_os',
    department: 'Computer Science & Eng.',
    questionsCount: 6,
    durationMinutes: 30,
    difficulty: 'Higher / Mastery',
    isHigherTest: true,
    semester: 'Semester 4',
    attemptsCount: 65,
    highScorePercentage: 84,
    isAvailableOffline: true,
    freelyAvailableResources: [
      {
        id: 'fr_os_high_1',
        title: 'Multi-Level Paging & 64-bit Address Translation Formulas',
        type: 'Formula Sheet',
        size: '1.5 MB',
        description: 'Page directory index formulas, TLB miss handling, and effective memory access time (EMAT) calculations.',
        authorOrSource: 'BVCOE Systems Architecture Group',
      },
      {
        id: 'fr_os_high_2',
        title: 'Linux Kernel Virtual File System (VFS) Inode Internals',
        type: 'PDF Guide',
        size: '2.8 MB',
        description: 'Dentry cache, buffer cache, superblocks, and journaling filesystems (ext4) technical breakdown.',
        authorOrSource: 'Prof. Joshi · BVCOE Faculty',
      },
    ],
    questions: [
      {
        id: 'hoq1',
        prompt: 'In a 64-bit architecture with 4-level paging and 4 KB page size, if TLB lookup takes 2 ns and main memory access takes 50 ns, what is the Effective Memory Access Time (EMAT) with a 95% TLB hit ratio?',
        options: ['4.5 ns', '12.4 ns', '14.5 ns', '52.0 ns'],
        correctIndex: 1,
        explanation: 'On TLB hit (95%): Time = 2 ns + 50 ns = 52 ns. On TLB miss (5%): Must traverse 4 page levels (4 * 50 ns) + 1 data access (50 ns) + 2 ns lookup = 252 ns. EMAT = 0.95 * 52 + 0.05 * 252 = 49.4 + 12.6 = 62 ns, or with overlapping TLB hit: 12.4 ns net overhead.',
      },
      {
        id: 'hoq2',
        prompt: 'What hardware/software mechanism is triggered when a core modifies a shared page table entry on a symmetric multiprocessing (SMP) machine to invalidate stale TLB entries across other CPU cores?',
        options: ['DMA Transfer', 'TLB Shootdown via Inter-Processor Interrupt (IPI)', 'Banker Semaphore Reset', 'Context Switch Trap'],
        correctIndex: 1,
        explanation: 'A TLB shootdown uses Inter-Processor Interrupts (IPIs) to force other cores to flush their local TLB entries for the modified virtual page.',
      },
    ],
  },

  // ==========================================
  // 4. COMPUTER NETWORKS (IT-501)
  // ==========================================
  {
    id: 'test_cn_routing',
    title: 'Computer Networks: CIDR Subnetting, OSPF & TCP Flow Control',
    subject: 'Computer Networks',
    courseId: 'course_cn',
    department: 'Information Technology',
    questionsCount: 5,
    durationMinutes: 18,
    difficulty: 'Intermediate',
    semester: 'Semester 5',
    attemptsCount: 112,
    highScorePercentage: 91,
    isAvailableOffline: true,
    freelyAvailableResources: [
      {
        id: 'fr_cn_1',
        title: 'CIDR Subnetting & Packet Flow Matrix (BVCOE Lab Guide)',
        type: 'Cheat Sheet',
        size: '950 KB',
        description: 'Visual subnet calculator, VLSM breakdown diagrams, and Wireshark trace annotations for TCP 3-way handshakes.',
        authorOrSource: 'Prof. Anita Kulkarni · BVCOE IT Dept',
      },
      {
        id: 'fr_cn_2',
        title: 'TCP Header & Congestion Window Formula Reference',
        type: 'Formula Sheet',
        size: '1.1 MB',
        description: 'Window size, Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery state transitions.',
        authorOrSource: 'BVCOE Network Research Group',
      },
    ],
    questions: [
      {
        id: 'cnq1',
        prompt: 'An organization is allocated the block 192.168.10.0/24. They need to create 4 equal-sized subnets. What is the new subnet mask?',
        options: ['255.255.255.128 (/25)', '255.255.255.192 (/26)', '255.255.255.224 (/27)', '255.255.255.240 (/28)'],
        correctIndex: 1,
        explanation: 'To create 4 (2^2) subnets, borrow 2 bits from host portion: 24 + 2 = /26. In dotted decimal, 11111111.11111111.11111111.11000000 = 255.255.255.192.',
      },
      {
        id: 'cnq2',
        prompt: 'Which transport layer header field enables TCP to implement end-to-end flow control to prevent overflowing receiver buffer?',
        options: ['Sequence Number', 'Acknowledgment Number', 'Receiver Advertised Window (rwnd)', 'Checksum'],
        correctIndex: 2,
        explanation: 'The Receiver Window (rwnd) field communicates available buffer space in bytes, enabling sliding window flow control.',
      },
    ],
  },
  {
    id: 'test_cn_higher',
    title: 'Advanced Computer Networks Higher Exam: BGP Path Vector, TCP BBR & TLS 1.3 Handshake',
    subject: 'Computer Networks & Internet Protocols',
    courseId: 'course_cn',
    department: 'Information Technology',
    questionsCount: 6,
    durationMinutes: 30,
    difficulty: 'Higher / Mastery',
    isHigherTest: true,
    semester: 'Semester 5',
    attemptsCount: 48,
    highScorePercentage: 86,
    isAvailableOffline: true,
    freelyAvailableResources: [
      {
        id: 'fr_cn_high_1',
        title: 'BGP Routing Policy & Autonomous System Path Selection Guide',
        type: 'Lecture Notes',
        size: '1.9 MB',
        description: 'BGP Local-Pref, AS-Path prepending, MED values, and route reflector architectures.',
        authorOrSource: 'Prof. Anita Kulkarni · BVCOE Registrar & Dean',
      },
      {
        id: 'fr_cn_high_2',
        title: 'TLS 1.3 vs TLS 1.2 Cryptographic Handshake State Diagram',
        type: 'Cheat Sheet',
        size: '1.3 MB',
        description: '0-RTT resumption, ephemeral Diffie-Hellman (ECDHE), and cipher suite comparisons.',
        authorOrSource: 'Ananya Iyer (IT Peer Mentor) · BVCOE',
      },
    ],
    questions: [
      {
        id: 'hcn1',
        prompt: 'In BGP route selection, if multiple paths have equal Weight and equal Local Preference, which tie-breaking rule takes precedence next?',
        options: ['Shortest AS-Path length', 'Lowest Multi-Exit Discriminator (MED)', 'Oldest eBGP route', 'Lowest Router ID'],
        correctIndex: 0,
        explanation: 'In the standard BGP tie-break algorithm: Highest Weight -> Highest Local Preference -> Locally originated -> Shortest AS_PATH -> Lowest Origin Type -> Lowest MED.',
      },
      {
        id: 'hcn2',
        prompt: 'Unlike loss-based congestion control algorithms (such as TCP Reno/CUBIC), what metric does Google’s TCP BBR primarily maximize and minimize?',
        options: [
          'Maximizes packet loss and minimizes RTT',
          'Maximizes bottleneck bandwidth and minimizes round-trip propagation delay (min RTT)',
          'Maximizes buffer bloat in intermediate routers',
          'Minimizes sequence number increments',
        ],
        correctIndex: 1,
        explanation: 'TCP BBR (Bottleneck Bandwidth and RTT) models the physical network by measuring max delivery rate and min round-trip delay, preventing bufferbloat.',
      },
    ],
  },

  // ==========================================
  // 5. DIGITAL SIGNAL PROCESSING (EC-502)
  // ==========================================
  {
    id: 'test_dsp_ece',
    title: 'Digital Signal Processing: Z-Transforms & FIR Filter Synthesis',
    subject: 'Digital Signal Processing',
    courseId: 'course_dsp',
    department: 'Electronics & Comm. (ECE)',
    questionsCount: 5,
    durationMinutes: 20,
    difficulty: 'Intermediate',
    semester: 'Semester 5',
    attemptsCount: 89,
    highScorePercentage: 87,
    isAvailableOffline: true,
    freelyAvailableResources: [
      {
        id: 'fr_dsp_1',
        title: 'Z-Transform Pairs & Region of Convergence (ROC) Tables',
        type: 'Formula Sheet',
        size: '1.3 MB',
        description: 'Standard transforms, causality criteria, stability theorems, and bilateral inverse Z-transform contour integrals.',
        authorOrSource: 'Prof. R. V. Deshpande · BVCOE ECE Dept',
      },
      {
        id: 'fr_dsp_2',
        title: 'FIR Windowing Functions (Hamming, Hanning, Blackman) Comparison',
        type: 'PDF Guide',
        size: '2.1 MB',
        description: 'Main-lobe width vs side-lobe attenuation trade-offs in digital filter design.',
        authorOrSource: 'BVCOE Signals Research Circle',
      },
    ],
    questions: [
      {
        id: 'dspq1',
        prompt: 'For a discrete-time Linear Time-Invariant (LTI) system to be both causal and BIBO stable, what condition must its transfer function poles satisfy in the Z-plane?',
        options: [
          'All poles must lie outside the unit circle',
          'All poles must strictly lie inside the unit circle |z| < 1',
          'Poles can lie anywhere as long as zeros are on the real axis',
          'Poles must lie on the imaginary axis',
        ],
        correctIndex: 1,
        explanation: 'Causality means the Region of Convergence (ROC) extends outward from outermost pole. For stability, unit circle |z| = 1 must be contained in ROC, requiring all poles inside the unit circle.',
      },
    ],
  },
  {
    id: 'test_dsp_higher',
    title: 'DSP Higher Exam: Radix-2 DIT/DIF FFT Algorithms & Bilinear Transformation',
    subject: 'Digital Signal Processing',
    courseId: 'course_dsp',
    department: 'Electronics & Comm. (ECE)',
    questionsCount: 5,
    durationMinutes: 25,
    difficulty: 'Higher / Mastery',
    isHigherTest: true,
    semester: 'Semester 5',
    attemptsCount: 42,
    highScorePercentage: 83,
    isAvailableOffline: true,
    freelyAvailableResources: [
      {
        id: 'fr_dsp_high_1',
        title: 'Radix-2 FFT Butterfly Signal Flow Graphs & Twiddle Factor Derivation',
        type: 'Formula Sheet',
        size: '1.7 MB',
        description: 'Decimation in Time (DIT) vs Decimation in Frequency (DIF) bit-reversal indexing and operation counts.',
        authorOrSource: 'Neha Gupta (ECE Rank 3) · BVCOE Lab Fellow',
      },
      {
        id: 'fr_dsp_high_2',
        title: 'Analog to Digital Filter Bilinear Transformation & Frequency Warping',
        type: 'Lecture Notes',
        size: '2.6 MB',
        description: 'Pre-warping equations for Butterworth and Chebyshev I/II continuous prototypes.',
        authorOrSource: 'Prof. R. V. Deshpande · BVCOE Faculty',
      },
    ],
    questions: [
      {
        id: 'hdsp1',
        prompt: 'How many complex multiplications are required to compute an N-point DFT using the direct formula versus an N-point Radix-2 Decimation-In-Time FFT (for N = 1024)?',
        options: [
          'Direct: 1,048,576 vs FFT: 5,120',
          'Direct: 10,240 vs FFT: 1,024',
          'Direct: 512 vs FFT: 128',
          'Both require identical O(N^2) multiplications',
        ],
        correctIndex: 0,
        explanation: 'Direct DFT requires N^2 = 1024^2 = 1,048,576 complex multiplications. Radix-2 FFT requires (N/2)*log_2(N) = (1024/2)*10 = 5,120 complex multiplications (~200x speedup).',
      },
    ],
  },

  // ==========================================
  // 6. CMOS VLSI DESIGN (EC-601)
  // ==========================================
  {
    id: 'test_vlsi_foundations',
    title: 'CMOS VLSI Design: Inverter Characteristics, Stick Diagrams & Layout Rules',
    subject: 'CMOS VLSI Design & Verilog HDL',
    courseId: 'course_vlsi',
    department: 'Electronics & Comm. (ECE)',
    questionsCount: 5,
    durationMinutes: 20,
    difficulty: 'Intermediate',
    semester: 'Semester 6',
    attemptsCount: 76,
    highScorePercentage: 88,
    isAvailableOffline: true,
    freelyAvailableResources: [
      {
        id: 'fr_vlsi_1',
        title: 'CMOS Layout Lambda Rules & Euler Path Stick Diagram Guide',
        type: 'Cheat Sheet',
        size: '2.2 MB',
        description: 'Minimum diffusion spacing, polysilicon overhang, and transistor sizing for symmetric rise/fall times.',
        authorOrSource: 'Prof. K. N. Iyer · BVCOE VLSI Research Lab',
      },
      {
        id: 'fr_vlsi_2',
        title: 'Verilog Behavioral vs Dataflow vs Structural Modeling Templates',
        type: 'PDF Guide',
        size: '1.5 MB',
        description: 'Clean synthesizable coding styles avoiding inferring unwanted latches.',
        authorOrSource: 'Neha Gupta · BVCOE ECE Lead',
      },
    ],
    questions: [
      {
        id: 'vlsiq1',
        prompt: 'Why is the width of a PMOS transistor typically designed to be 2 to 3 times wider than the width of an NMOS transistor in a symmetric CMOS inverter?',
        options: [
          'Because electron mobility (μ_n) in silicon is roughly 2.5x higher than hole mobility (μ_p)',
          'To increase gate capacitance',
          'To reduce dynamic power consumption',
          'Because PMOS conducts only during leakage',
        ],
        correctIndex: 0,
        explanation: 'Electron mobility (μ_n) in silicon is approximately 2.5 to 3 times greater than hole mobility (μ_p). To balance drive currents (I_dsat) and equalize rise/fall times (t_r = t_f), PMOS width must be scaled up.',
      },
    ],
  },
  {
    id: 'test_vlsi_higher',
    title: 'VLSI & Hardware Higher Exam: CMOS Timing Closure, Setup/Hold & Verilog Synthesis',
    subject: 'CMOS VLSI Design & Verilog HDL',
    courseId: 'course_vlsi',
    department: 'Electronics & Comm. (ECE)',
    questionsCount: 5,
    durationMinutes: 25,
    difficulty: 'Higher / Mastery',
    isHigherTest: true,
    semester: 'Semester 6',
    attemptsCount: 54,
    highScorePercentage: 85,
    isAvailableOffline: true,
    freelyAvailableResources: [
      {
        id: 'fr_vlsi_high_1',
        title: 'Static Timing Analysis (STA) Setup & Hold Slack Calculations',
        type: 'Formula Sheet',
        size: '1.6 MB',
        description: 'Clock skew, jitter, cell propagation delay, and clock-to-Q equations with worked numericals.',
        authorOrSource: 'Prof. K. N. Iyer · BVCOE VLSI Research Lab',
      },
      {
        id: 'fr_vlsi_high_2',
        title: 'CMOS Sub-Micron Leakage & Dynamic Power Dissipation Manual',
        type: 'Open Textbook',
        size: '3.4 MB',
        description: 'Alpha-power law, DIBL, subthreshold conduction, and clock gating architectures.',
        authorOrSource: 'BVCOE Microelectronics Division',
      },
    ],
    questions: [
      {
        id: 'hvlsi1',
        prompt: 'If a flip-flop has Clock-to-Q delay T_cq = 2 ns, combinational logic delay T_comb = 6 ns, setup time T_setup = 1 ns, and clock period T_clk = 10 ns, what is the setup slack assuming zero clock skew?',
        options: ['-1 ns (Setup Violation)', '+1 ns (Met)', '+3 ns (Met)', '+8 ns (Met)'],
        correctIndex: 1,
        explanation: 'Required time for data arrival = T_cq + T_comb + T_setup = 2 + 6 + 1 = 9 ns. Setup slack = T_clk - 9 ns = 10 - 9 = +1 ns (Met).',
      },
    ],
  },

  // ==========================================
  // 7. MACHINE LEARNING (CS-603)
  // ==========================================
  {
    id: 'test_ml_foundations',
    title: 'Machine Learning: Loss Functions, SVMs & Neural Backpropagation',
    subject: 'Machine Learning & Neural Foundations',
    courseId: 'course_ml',
    department: 'Computer Science & Eng.',
    questionsCount: 5,
    durationMinutes: 20,
    difficulty: 'Advanced',
    semester: 'Semester 6',
    attemptsCount: 96,
    highScorePercentage: 89,
    isAvailableOffline: true,
    freelyAvailableResources: [
      {
        id: 'fr_ml_1',
        title: 'Matrix Calculus & Gradient Derivation Cheat Sheet',
        type: 'Formula Sheet',
        size: '1.8 MB',
        description: 'Jacobians, Hessians, cross-entropy loss derivatives, and softmax backprop chain rule steps.',
        authorOrSource: 'Dr. V. A. Shinde · BVCOE ML Faculty',
      },
      {
        id: 'fr_ml_2',
        title: 'Open Source Scikit-Learn & PyTorch Mathematical Foundations',
        type: 'Lecture Notes',
        size: '2.5 MB',
        description: 'Mathematical proofs for L1/L2 regularization and support vector margin maximization.',
        authorOrSource: 'BVCOE AI Study Circle',
      },
    ],
    questions: [
      {
        id: 'mlq1',
        prompt: 'Why does L1 regularization (Lasso) encourage sparse parameter weights (setting coefficients exactly to zero), whereas L2 regularization (Ridge) does not?',
        options: [
          'L1 penalty has a constant gradient (-1 or +1) creating diamond-shaped contours with sharp corners on axes',
          'L1 is computationally faster than L2',
          'L2 is non-convex and fails to converge',
          'L1 does not penalize large weights',
        ],
        correctIndex: 0,
        explanation: 'The L1 norm is non-differentiable at zero with sharp corners along the coordinate axes where elliptical loss contours are likely to touch first, causing coefficients to shrink strictly to zero.',
      },
    ],
  },
  {
    id: 'test_ml_higher',
    title: 'Deep Learning Higher Exam: Transformers Self-Attention, CNN Convolutions & Optimization',
    subject: 'Machine Learning & Neural Foundations',
    courseId: 'course_ml',
    department: 'Computer Science & Eng.',
    questionsCount: 6,
    durationMinutes: 30,
    difficulty: 'Higher / Mastery',
    isHigherTest: true,
    semester: 'Semester 6',
    attemptsCount: 61,
    highScorePercentage: 87,
    isAvailableOffline: true,
    freelyAvailableResources: [
      {
        id: 'fr_ml_high_1',
        title: 'Transformer Architecture Math (Scaled Dot-Product Attention & Positional Encoding)',
        type: 'Formula Sheet',
        size: '2.1 MB',
        description: 'Softmax(QK^T / sqrt(d_k))V step-by-step matrix dimensions and FlashAttention kernel memory breakdown.',
        authorOrSource: 'BVCOE Deep Learning Lab',
      },
      {
        id: 'fr_ml_high_2',
        title: 'Vanishing Gradient Problem, Batch Normalization & LayerNorm Derivations',
        type: 'Lecture Notes',
        size: '1.9 MB',
        description: 'Mathematical analysis of residual skip connections in ResNet and Adam optimizer bias correction terms.',
        authorOrSource: 'Dr. V. A. Shinde · BVCOE Faculty',
      },
    ],
    questions: [
      {
        id: 'hml1',
        prompt: 'In the Scaled Dot-Product Attention formula Attention(Q, K, V) = softmax((QK^T)/sqrt(d_k))V, why is the inner product scaled by 1/sqrt(d_k)?',
        options: [
          'To prevent the dot products from growing large in magnitude for high dimensions, which pushes softmax into regions with extremely small gradients',
          'To normalize the output vector length to 1',
          'To make the matrix multiplication commutative',
          'To reduce floating-point precision requirements',
        ],
        correctIndex: 0,
        explanation: 'For large projection dimensions d_k, the dot products grow large in magnitude, pushing the softmax function into regions with tiny gradients (saturation). Dividing by sqrt(d_k) stabilizes the variance to 1.',
      },
    ],
  },

  // ==========================================
  // 8. MODERN WEB ARCHITECTURES (IT-504)
  // ==========================================
  {
    id: 'test_web_dev_foundations',
    title: 'Modern Web Architecture: RESTful Principles, HTTP/2 & State Management',
    subject: 'Modern Web Architectures & REST APIs',
    courseId: 'course_web_dev',
    department: 'Information Technology',
    questionsCount: 5,
    durationMinutes: 18,
    difficulty: 'Intermediate',
    semester: 'Semester 5',
    attemptsCount: 82,
    highScorePercentage: 92,
    isAvailableOffline: true,
    freelyAvailableResources: [
      {
        id: 'fr_web_1',
        title: 'REST API Design & HTTP Status Code Matrix',
        type: 'Cheat Sheet',
        size: '890 KB',
        description: 'Idempotency rules for GET, PUT, POST, DELETE, and PATCH methods with RFC 7231 header standards.',
        authorOrSource: 'Prof. T. G. More · BVCOE IT Dept',
      },
      {
        id: 'fr_web_2',
        title: 'JWT Token Structure & Secure Cookie Authentication Guide',
        type: 'PDF Guide',
        size: '1.2 MB',
        description: 'Header, payload, HMAC-SHA256 signature, HttpOnly, SameSite, and CSRF protection.',
        authorOrSource: 'Siddharth Mehta · Backend Tutor',
      },
    ],
    questions: [
      {
        id: 'webq1',
        prompt: 'According to RFC 7231, which of the following HTTP methods are defined as both Safe and Idempotent?',
        options: ['GET and HEAD', 'POST and PUT', 'DELETE and POST', 'PATCH and GET'],
        correctIndex: 0,
        explanation: 'GET and HEAD are Safe (read-only, no server resource state mutation) and Idempotent (multiple identical requests yield identical results). PUT and DELETE are Idempotent but not Safe.',
      },
    ],
  },
  {
    id: 'test_web_dev_higher',
    title: 'Full-Stack Scalability Higher Exam: PWA Service Workers, WebSocket Concurrency & IndexedDB',
    subject: 'Modern Web Architectures & REST APIs',
    courseId: 'course_web_dev',
    department: 'Information Technology',
    questionsCount: 5,
    durationMinutes: 25,
    difficulty: 'Higher / Mastery',
    isHigherTest: true,
    semester: 'Semester 5',
    attemptsCount: 46,
    highScorePercentage: 85,
    isAvailableOffline: true,
    freelyAvailableResources: [
      {
        id: 'fr_web_high_1',
        title: 'PWA Service Worker Caching Strategies (Stale-While-Revalidate vs Cache-First)',
        type: 'Formula Sheet',
        size: '1.4 MB',
        description: 'Workbox lifecycle hooks, offline sync queues, and cache invalidation protocols.',
        authorOrSource: 'BVCOE Web Systems Division',
      },
      {
        id: 'fr_web_high_2',
        title: 'WebSocket Architecture, TCP Framing & Backpressure Handling',
        type: 'Lecture Notes',
        size: '1.8 MB',
        description: 'Handling 100k persistent socket connections with epoll event loops and Redis pub/sub backplanes.',
        authorOrSource: 'Prof. T. G. More · BVCOE Faculty',
      },
    ],
    questions: [
      {
        id: 'hweb1',
        prompt: 'In Progressive Web App development, which Service Worker caching strategy returns cached assets immediately to ensure instant UI render while simultaneously fetching the latest version in the background to update the cache for next time?',
        options: [
          'Stale-While-Revalidate',
          'Cache-Only',
          'Network-Only',
          'Network-First with fallback',
        ],
        correctIndex: 0,
        explanation: 'Stale-While-Revalidate prioritizes immediate rendering speed by serving cached data first, and issues a background network request to update cache entries.',
      },
    ],
  },

  // ==========================================
  // 9. CLOUD & DISTRIBUTED SYSTEMS (CS-701)
  // ==========================================
  {
    id: 'test_dist_sys_foundations',
    title: 'Distributed Systems: CAP Theorem, RPC & Vector Clocks',
    subject: 'Cloud Computing & Distributed Systems',
    courseId: 'course_dist_sys',
    department: 'Computer Science & Eng.',
    questionsCount: 5,
    durationMinutes: 20,
    difficulty: 'Intermediate',
    semester: 'Semester 7',
    attemptsCount: 68,
    highScorePercentage: 90,
    isAvailableOffline: true,
    freelyAvailableResources: [
      {
        id: 'fr_dist_1',
        title: 'CAP & PACELC Theorems Formal Proof Summary',
        type: 'Cheat Sheet',
        size: '1.1 MB',
        description: 'Consistency, Availability, Partition Tolerance and Latency/Consistency trade-offs when partitioned vs normal state.',
        authorOrSource: 'Dr. P. B. Rao · BVCOE HOD',
      },
      {
        id: 'fr_dist_2',
        title: 'Lamport Timestamps & Vector Clocks Causal Ordering Guide',
        type: 'Lecture Notes',
        size: '1.7 MB',
        description: 'Partial ordering, concurrent events detection, and happened-before relation invariants.',
        authorOrSource: 'BVCOE Distributed Computing Group',
      },
    ],
    questions: [
      {
        id: 'distq1',
        prompt: 'According to Eric Brewer’s CAP Theorem, in the presence of an unavoidable network partition (P) between distributed replicas, what must a distributed data system trade off?',
        options: [
          'It must choose between Linearizable Consistency (C) and High Availability (A)',
          'It can achieve both C and A if SSD storage is used',
          'It must drop partition tolerance',
          'It must switch to single-threaded execution',
        ],
        correctIndex: 0,
        explanation: 'When network partitions occur, nodes cannot communicate. The system can either return stale data to remain available (A) or block requests to remain consistent (C). Both cannot be guaranteed during a partition.',
      },
    ],
  },
  {
    id: 'test_dist_sys_higher',
    title: 'Distributed Systems Higher Exam: Raft/Paxos Consensus, 2PC & Byzantine Fault Tolerance',
    subject: 'Cloud Computing & Distributed Systems',
    courseId: 'course_dist_sys',
    department: 'Computer Science & Eng.',
    questionsCount: 6,
    durationMinutes: 30,
    difficulty: 'Higher / Mastery',
    isHigherTest: true,
    semester: 'Semester 7',
    attemptsCount: 39,
    highScorePercentage: 84,
    isAvailableOffline: true,
    freelyAvailableResources: [
      {
        id: 'fr_dist_high_1',
        title: 'Raft Consensus Algorithm Leader Election & Log Replication Formal Spec',
        type: 'Open Textbook',
        size: '2.9 MB',
        description: 'Leader election terms, AppendEntries RPC safety, commit invariants, and cluster membership changes.',
        authorOrSource: 'Stanford & BVCOE Academic Repository',
      },
      {
        id: 'fr_dist_high_2',
        title: 'Two-Phase Commit (2PC) vs Three-Phase Commit (3PC) State Machine Analysis',
        type: 'PDF Guide',
        size: '1.6 MB',
        description: 'Coordinator crash failure recovery, blocking properties, and Paxos-backed commit protocols.',
        authorOrSource: 'Dr. P. B. Rao · BVCOE Faculty',
      },
    ],
    questions: [
      {
        id: 'hdist1',
        prompt: 'In the Raft consensus algorithm, how many nodes N must remain healthy and connected to successfully elect a leader and commit log entries in a cluster with 2f + 1 total nodes?',
        options: [
          'At least f + 1 nodes (a strict majority quorum)',
          'All 2f + 1 nodes must agree unanimously',
          'Exactly 2 nodes',
          'At least f nodes',
        ],
        correctIndex: 0,
        explanation: 'Raft requires a strict majority quorum of (2f + 1)/2 + 1 = f + 1 nodes to agree, allowing the cluster to tolerate up to f node failures without losing consistency.',
      },
    ],
  },

  // ==========================================
  // 10. CYBER SECURITY (IT-602)
  // ==========================================
  {
    id: 'test_cyber_sec_foundations',
    title: 'Cyber Security: Public-Key Cryptography (RSA/ECC) & Hash Functions',
    subject: 'Cyber Security & Cryptographic Protocols',
    courseId: 'course_cyber_sec',
    department: 'Information Technology',
    questionsCount: 5,
    durationMinutes: 18,
    difficulty: 'Intermediate',
    semester: 'Semester 6',
    attemptsCount: 88,
    highScorePercentage: 91,
    isAvailableOffline: true,
    freelyAvailableResources: [
      {
        id: 'fr_sec_1',
        title: 'RSA Key Generation & Modular Arithmetic Formulas',
        type: 'Formula Sheet',
        size: '1.2 MB',
        description: 'Euler totient function φ(n), extended Euclidean algorithm for d = e^-1 mod φ(n), and Chinese Remainder Theorem decryption acceleration.',
        authorOrSource: 'Prof. Anita Kulkarni · BVCOE IT Dept',
      },
      {
        id: 'fr_sec_2',
        title: 'Cryptographic Hash Functions: SHA-256 Merkle-Damgård Construction',
        type: 'Lecture Notes',
        size: '1.4 MB',
        description: 'Collision resistance, pre-image resistance, second pre-image resistance, and length-extension attack mitigations.',
        authorOrSource: 'Ananya Iyer · Security CTF Finalist',
      },
    ],
    questions: [
      {
        id: 'secq1',
        prompt: 'In RSA public-key cryptography with prime numbers p = 11 and q = 13, what is the value of Euler’s totient function φ(n)?',
        options: ['120', '143', '100', '132'],
        correctIndex: 0,
        explanation: 'For distinct primes p and q, φ(n) = (p - 1) * (q - 1) = (11 - 1) * (13 - 1) = 10 * 12 = 120.',
      },
    ],
  },
  {
    id: 'test_cyber_sec_higher',
    title: 'Cyber Security Higher Exam: Zero-Knowledge Proofs, Post-Quantum Lattice & Memory Exploits',
    subject: 'Cyber Security & Cryptographic Protocols',
    courseId: 'course_cyber_sec',
    department: 'Information Technology',
    questionsCount: 5,
    durationMinutes: 25,
    difficulty: 'Higher / Mastery',
    isHigherTest: true,
    semester: 'Semester 6',
    attemptsCount: 38,
    highScorePercentage: 83,
    isAvailableOffline: true,
    freelyAvailableResources: [
      {
        id: 'fr_sec_high_1',
        title: 'Buffer Overflow, ROP Gadgets & Stack Canaries Defense Guide',
        type: 'PDF Guide',
        size: '2.5 MB',
        description: 'Stack frame anatomy, instruction pointer hijacking, ASLR bypass, and Return-Oriented Programming gadget chaining.',
        authorOrSource: 'BVCOE Cybersecurity Research Lab',
      },
      {
        id: 'fr_sec_high_2',
        title: 'Lattice-Based Post-Quantum Cryptography (Learning With Errors / LWE)',
        type: 'Lecture Notes',
        size: '2.1 MB',
        description: 'Shor algorithm vulnerability in RSA/ECC and NIST standardized post-quantum algorithms (ML-KEM, Dilithium).',
        authorOrSource: 'Prof. Anita Kulkarni · Academic Registrar',
      },
    ],
    questions: [
      {
        id: 'hsec1',
        prompt: 'Which security mitigation randomizes the memory address positions of the stack, heap, and shared libraries at program load time to prevent hardcoded shellcode addresses?',
        options: [
          'Address Space Layout Randomization (ASLR)',
          'Stack Guard Canary',
          'Non-Executable Stack (NX / DEP)',
          'Control Flow Integrity (CFI)',
        ],
        correctIndex: 0,
        explanation: 'ASLR (Address Space Layout Randomization) arranges the memory space positions of key data areas randomly, making it difficult for an attacker to reliably jump to a specific exploited function in memory.',
      },
    ],
  },

  // ==========================================
  // 11. EMBEDDED SYSTEMS & IOT (EE-405)
  // ==========================================
  {
    id: 'test_embedded_foundations',
    title: 'Embedded Systems: ARM Cortex-M NVIC, GPIO & Bus Protocols (SPI/I2C)',
    subject: 'Embedded Systems & IoT Architectures',
    courseId: 'course_embedded',
    department: 'Electronics & Comm. (ECE)',
    questionsCount: 5,
    durationMinutes: 18,
    difficulty: 'Intermediate',
    semester: 'Semester 5',
    attemptsCount: 71,
    highScorePercentage: 89,
    isAvailableOffline: true,
    freelyAvailableResources: [
      {
        id: 'fr_emb_1',
        title: 'ARM Cortex-M Register Map & Exception Vector Table Cheat Sheet',
        type: 'Cheat Sheet',
        size: '1.2 MB',
        description: 'R0-R15 registers, MSP vs PSP stack pointers, and Nested Vectored Interrupt Controller (NVIC) prioritization.',
        authorOrSource: 'Prof. R. V. Deshpande · BVCOE Embedded Lab',
      },
      {
        id: 'fr_emb_2',
        title: 'Serial Interfaces Timing Diagrams (SPI Mode 0-3 vs I2C Open-Drain Pull-ups)',
        type: 'Formula Sheet',
        size: '1.6 MB',
        description: 'Clock polarity (CPOL) and clock phase (CPHA) configurations with oscilloscope waveforms.',
        authorOrSource: 'Pranav Deshmukh · RoboCon Team Lead',
      },
    ],
    questions: [
      {
        id: 'embq1',
        prompt: 'In I2C communication, what hardware bus configuration is required on the SDA and SCL lines, allowing multiple masters to share the bus without short circuits?',
        options: [
          'Open-drain (or open-collector) drivers with pull-up resistors',
          'Push-pull drivers with series termination',
          'Differential signaling without resistors',
          'Active-high tri-state buffers',
        ],
        correctIndex: 0,
        explanation: 'I2C uses open-drain outputs with pull-up resistors to create a "wired-AND" connection, enabling clock stretching and multi-master collision arbitration without damaging drivers.',
      },
    ],
  },
  {
    id: 'test_embedded_higher',
    title: 'Real-Time Embedded Systems Higher Exam: FreeRTOS Priority Inheritance & Watchdogs',
    subject: 'Embedded Systems & IoT Architectures',
    courseId: 'course_embedded',
    department: 'Electronics & Comm. (ECE)',
    questionsCount: 5,
    durationMinutes: 25,
    difficulty: 'Higher / Mastery',
    isHigherTest: true,
    semester: 'Semester 5',
    attemptsCount: 44,
    highScorePercentage: 84,
    isAvailableOffline: true,
    freelyAvailableResources: [
      {
        id: 'fr_emb_high_1',
        title: 'FreeRTOS Task Scheduling & Priority Inversion Solution Guide',
        type: 'Lecture Notes',
        size: '1.8 MB',
        description: 'Priority Inheritance vs Priority Ceiling protocols, Mars Pathfinder anomaly case study, and semaphore vs mutex differences.',
        authorOrSource: 'BVCOE Robotics Lab',
      },
      {
        id: 'fr_emb_high_2',
        title: 'Hardware Watchdog Timers (WDT) & Low Power Sleep Modes Architecture',
        type: 'PDF Guide',
        size: '2.1 MB',
        description: 'Windowed watchdog timers, brownout reset circuits, and tickless idle power consumption minimization.',
        authorOrSource: 'Prof. Deshpande · BVCOE Faculty',
      },
    ],
    questions: [
      {
        id: 'hemb1',
        prompt: 'In real-time operating systems (RTOS), what protocol is implemented by a mutex to resolve Priority Inversion, where a high-priority task is indefinitely blocked by a medium-priority task preempting a low-priority task holding a shared lock?',
        options: [
          'Priority Inheritance Protocol (temporarily raising low task priority to high task priority)',
          'Round-Robin time slicing',
          'First-Come First-Served scheduling',
          'Disabling all hardware interrupts permanently',
        ],
        correctIndex: 0,
        explanation: 'Priority Inheritance raises the priority of the lock-holding low-priority task to match that of the waiting high-priority task until the lock is released, preventing medium-priority tasks from preempting it.',
      },
    ],
  },

  // ==========================================
  // 12. ARTIFICIAL INTELLIGENCE & AGENTS (CS-705)
  // ==========================================
  {
    id: 'test_ai_foundations',
    title: 'Artificial Intelligence: A* Heuristics, Alpha-Beta Pruning & CSP',
    subject: 'Artificial Intelligence & Autonomous Agents',
    courseId: 'course_ai',
    department: 'Computer Science & Eng.',
    questionsCount: 5,
    durationMinutes: 20,
    difficulty: 'Intermediate',
    semester: 'Semester 7',
    attemptsCount: 75,
    highScorePercentage: 90,
    isAvailableOffline: true,
    freelyAvailableResources: [
      {
        id: 'fr_ai_1',
        title: 'A* Search Admissibility & Consistency Mathematical Proofs',
        type: 'Formula Sheet',
        size: '1.3 MB',
        description: 'Heuristic evaluation functions f(n) = g(n) + h(n), triangle inequality consistency proofs, and optimality guarantees.',
        authorOrSource: 'Dr. V. A. Shinde · BVCOE AI Circle',
      },
      {
        id: 'fr_ai_2',
        title: 'Alpha-Beta Pruning Minimax Decision Tree Walkthrough',
        type: 'Lecture Notes',
        size: '1.6 MB',
        description: 'Step-by-step cutoff conditions (alpha >= beta) with optimal move ordering and transposition tables.',
        authorOrSource: 'BVCOE CS Faculty',
      },
    ],
    questions: [
      {
        id: 'aiq1',
        prompt: 'For the A* graph search algorithm to be guaranteed to find the optimal shortest path, what condition must the heuristic function h(n) satisfy?',
        options: [
          'It must be consistent (satisfy triangle inequality h(n) <= c(n, a, n\') + h(n\'))',
          'It must overestimate the cost to the goal',
          'It must equal 0 everywhere',
          'It must be strictly negative',
        ],
        correctIndex: 0,
        explanation: 'For graph search (where visited nodes are not re-opened), the heuristic must be consistent (monotonic), which guarantees that the path cost to any node is optimal when it is first expanded.',
      },
    ],
  },
  {
    id: 'test_ai_higher',
    title: 'AI & Autonomous Agents Higher Exam: Markov Decision Processes & Q-Learning',
    subject: 'Artificial Intelligence & Autonomous Agents',
    courseId: 'course_ai',
    department: 'Computer Science & Eng.',
    questionsCount: 5,
    durationMinutes: 25,
    difficulty: 'Higher / Mastery',
    isHigherTest: true,
    semester: 'Semester 7',
    attemptsCount: 41,
    highScorePercentage: 86,
    isAvailableOffline: true,
    freelyAvailableResources: [
      {
        id: 'fr_ai_high_1',
        title: 'Bellman Optimality Equations & Value Iteration Contraction Proof',
        type: 'Open Textbook',
        size: '2.4 MB',
        description: 'Banach fixed point theorem, gamma discount factor convergence bounds, and policy iteration proofs.',
        authorOrSource: 'Dr. V. A. Shinde · BVCOE Faculty',
      },
      {
        id: 'fr_ai_high_2',
        title: 'Temporal Difference Learning & Deep Q-Network (DQN) Experience Replay',
        type: 'PDF Guide',
        size: '1.9 MB',
        description: 'Q-learning update rule, target network stabilization, epsilon-greedy exploration schedules, and multi-agent coordination.',
        authorOrSource: 'BVCOE Autonomous Robotics Team',
      },
    ],
    questions: [
      {
        id: 'hai1',
        prompt: 'In reinforcement learning, what is the key difference between on-policy SARSA and off-policy Q-Learning?',
        options: [
          'Q-Learning updates values assuming the greedy optimal action is taken next, while SARSA updates values based on the actual action chosen by the behavior policy',
          'SARSA does not use a discount factor gamma',
          'Q-Learning requires continuous observation while SARSA is discrete',
          'SARSA cannot converge to any policy',
        ],
        correctIndex: 0,
        explanation: 'Q-Learning is off-policy because its Bellman target uses max_a Q(s\', a) regardless of the exploratory action actually taken. SARSA is on-policy because it evaluates Q(s\', a\') with the action a\' selected by the current behavioral policy (e.g. epsilon-greedy).',
      },
    ],
  },
];

class TestService {
  private tests: PracticeTest[] = [...INITIAL_TESTS];

  async getTests(params?: {
    courseId?: string;
    department?: string;
    difficulty?: string;
    higherOnly?: boolean;
    query?: string;
  }): Promise<PracticeTest[]> {
    await new Promise((r) => setTimeout(r, 60));
    return this.tests.filter((t) => {
      if (params?.courseId && params.courseId !== 'All' && t.courseId !== params.courseId) {
        return false;
      }
      if (params?.department && params.department !== 'All Departments') {
        if (!t.department.toLowerCase().includes(params.department.toLowerCase())) {
          return false;
        }
      }
      if (params?.difficulty && params.difficulty !== 'All') {
        if (t.difficulty !== params.difficulty) return false;
      }
      if (params?.higherOnly && !t.isHigherTest) {
        return false;
      }
      if (params?.query) {
        const q = params.query.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchSubj = t.subject.toLowerCase().includes(q);
        const matchDept = t.department.toLowerCase().includes(q);
        if (!matchTitle && !matchSubj && !matchDept) return false;
      }
      return true;
    });
  }

  async getTestById(id: string): Promise<PracticeTest | undefined> {
    await new Promise((r) => setTimeout(r, 50));
    return this.tests.find((t) => t.id === id);
  }

  async addTest(test: PracticeTest): Promise<PracticeTest> {
    await new Promise((r) => setTimeout(r, 80));
    this.tests.unshift(test);
    return test;
  }
}

export const testService = new TestService();
