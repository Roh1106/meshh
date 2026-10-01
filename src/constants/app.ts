export const APP_NAME = 'SkillMesh';
export const APP_VERSION = '0.1.0';
export const DEFAULT_CAMPUS = {
  id: 'bvcoe-pune',
  name: 'Bharti Vidyapeeth College of Engineering',
  alternateName: 'Bharati Vidyapeeth College of Engineering',
  shortName: 'BVCOE',
  city: 'Pune / Navi Mumbai / New Delhi',
  departmentList: [
    'Computer Science & Eng.',
    'Information Technology',
    'Electronics & Comm. (ECE)',
    'Mechanical Engineering',
    'Electrical & Electronics',
    'Civil Engineering',
    'Chemical Engineering',
  ],
};

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'faculty';
  avatar: string;
  department: string;
  year?: string;
  rollNo?: string;
  designation?: string;
  bio: string;
  karma: number;
  verifiedSkillsCount: number;
  mentoringSessionsCount: number;
  resourcesContributedCount: number;
  canTeach?: { name: string; level: string; verified: boolean; peerCount: number }[];
  wantsToLearn?: { name: string; level: string; priority: string }[];
  availability?: string;
  languages: string[];
  badges: { id: string; name: string; icon: string; date: string }[];
  enrolledCourseIds: string[];
}

export const PRESET_USERS: AppUser[] = [
  {
    id: 'usr_rohan_ranmale',
    name: 'Rohan Ranmale',
    email: 'rohan.ranmale@bvu.edu.in',
    role: 'student',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK8O_FLVEHVKGWJwYN720Txxmi2aR44Fftcmp6KUe_aCCcHc1pelyNEjVHEmc2psynsu1VmPAkgcEUMoU4Gw9rnJCl8Aic6HX5IPjEaOMoVsR3C_oT25CccR_KMc14mYqU1zbtstEbJGB_GOFAuVCK9ItPNhNXZzr2gRfDvLT00lgawDC2mKCxoLE8rmY_hywOtBUWeJmtwNLsuh66gitzC_4ztLQP56EF0-4Y8u1KgwCeoVH0Iws03g',
    department: 'Computer Science & Eng.',
    year: '3rd Year',
    rollNo: 'BV-22CS084',
    bio: 'CS undergrad at Bharati Vidyapeeth College of Engineering. Focused on systems programming, distributed data, and peer tutoring in algorithms.',
    karma: 480,
    verifiedSkillsCount: 6,
    mentoringSessionsCount: 14,
    resourcesContributedCount: 5,
    canTeach: [
      { name: 'Python', level: 'Advanced', verified: true, peerCount: 22 },
      { name: 'Data Structures & Algorithms', level: 'Intermediate', verified: true, peerCount: 19 },
      { name: 'Git & Version Control', level: 'Intermediate', verified: true, peerCount: 11 },
    ],
    wantsToLearn: [
      { name: 'FastAPI Backend Architecture', level: 'Beginner', priority: 'High' },
      { name: 'DSP & Circuit Design', level: 'Beginner', priority: 'Medium' },
      { name: 'UI/UX Design', level: 'Intermediate', priority: 'High' },
    ],
    availability: 'Mon, Wed, Fri 4:00 PM – 7:00 PM',
    languages: ['English', 'Hindi', 'Marathi'],
    badges: [
      { id: 'b1', name: 'BVCOE Peer Tutor', icon: 'award', date: 'Fall 2026' },
      { id: 'b2', name: 'Verified Contributor', icon: 'shield-check', date: 'Spring 2026' },
      { id: 'b3', name: 'Campus Mesh Pioneer', icon: 'radio', date: '2026' },
    ],
    enrolledCourseIds: ['course_dsa', 'course_dbms', 'course_os'],
  },
  {
    id: 'usr_neha_gupta',
    name: 'Neha Gupta',
    email: 'neha.gupta@bvu.edu.in',
    role: 'student',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd9aCuxM3XzxIggPf8_RXnvfZZkUHH98aRwvTQgFzjbHVWImO3H_FN11PL9--EM0jWAElcFffdSsOhrscHfa_NYRx-VG1xny6CHERhMJWb-A_bjF7Ju0QDRv9QJop9vF5X2KKXLXCg-3uFrLP37yIMze2FXfodafopeiKfwbisP57TQVNxTzkJ3RTEBG_QinC57HgnJs69FixXrGBxoo6ZZawUaxv2k5-kyfLbPAOg_lnRA7zq-WaiNg',
    department: 'Electronics & Comm. (ECE)',
    year: '3rd Year',
    rollNo: 'BV-22EC012',
    bio: 'Dept Rank 3 in ECE at BVCOE. Specializing in FPGA synthesis, DSP filter design, and embedded hardware.',
    karma: 620,
    verifiedSkillsCount: 8,
    mentoringSessionsCount: 22,
    resourcesContributedCount: 7,
    canTeach: [
      { name: 'DSP Filter Design', level: 'Advanced', verified: true, peerCount: 28 },
      { name: 'Verilog HDL', level: 'Advanced', verified: true, peerCount: 24 },
      { name: 'Circuit Design', level: 'Intermediate', verified: true, peerCount: 16 },
    ],
    wantsToLearn: [
      { name: 'Python for Data Science / Pandas', level: 'Beginner', priority: 'High' },
      { name: 'Machine Learning', level: 'Beginner', priority: 'High' },
    ],
    availability: 'Tue, Thu 3:00 PM – 6:00 PM',
    languages: ['English', 'Hindi'],
    badges: [
      { id: 'b4', name: 'ECE Dept Rank 3', icon: 'award', date: '2026' },
      { id: 'b5', name: 'Lab Fellow', icon: 'shield-check', date: '2026' },
    ],
    enrolledCourseIds: ['course_dsp', 'course_vlsi'],
  },
  {
    id: 'usr_aarav_sharma',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@bvu.edu.in',
    role: 'student',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkLp7VVctQ7ZRqzUv8Q7JLtJFcX2OhbVdo_CiAy-mUvGTLsghngTUYb2gCmRbMZ47wcjGZGcS2ufGFVFrX10LdaacQTMqU-xKMUxD9_MKi0dsMT79PzqfFg6atG2h6OPwOWFbvctw-XHOWVOPEY7gbn0JlRM2-wLvsABG0ph_oLjLdLtIwBWbg_Xrjg9ybd0NIOWnjboVK4JMDrDS0y-TuQT0CBGBFGOj79b4YY3hJKMprSPSstTYSbg',
    department: 'Computer Science & Eng.',
    year: '4th Year',
    rollNo: 'BV-21CS005',
    bio: 'Lead Peer Tutor at BVCOE ACM Chapter. Working on distributed systems and advanced algorithms.',
    karma: 940,
    verifiedSkillsCount: 12,
    mentoringSessionsCount: 46,
    resourcesContributedCount: 14,
    canTeach: [
      { name: 'Advanced Algorithms', level: 'Advanced', verified: true, peerCount: 42 },
      { name: 'Distributed Systems', level: 'Advanced', verified: true, peerCount: 31 },
      { name: 'C++', level: 'Advanced', verified: true, peerCount: 36 },
    ],
    wantsToLearn: [
      { name: 'Rust', level: 'Intermediate', priority: 'Medium' },
    ],
    availability: 'Daily 4:00 PM – 6:00 PM at Tech Park Cafe',
    languages: ['English', 'Hindi', 'Gujarati'],
    badges: [
      { id: 'b6', name: 'Distinguished Tutor', icon: 'award', date: '2025' },
      { id: 'b7', name: 'ACM Chapter Lead', icon: 'star', date: '2026' },
    ],
    enrolledCourseIds: ['course_dsa', 'course_dist_sys', 'course_cn'],
  },
  {
    id: 'usr_siddharth_m',
    name: 'Siddharth Mehta',
    email: 'siddharth.m@bvu.edu.in',
    role: 'student',
    avatar: '',
    department: 'Computer Science & Eng.',
    year: '4th Year',
    rollNo: 'BV-21CS042',
    bio: 'Backend enthusiast building microservices with FastAPI and SQLite. Looking to pair up for capstone mobile app.',
    karma: 390,
    verifiedSkillsCount: 5,
    mentoringSessionsCount: 9,
    resourcesContributedCount: 4,
    canTeach: [
      { name: 'FastAPI Backend Architecture', level: 'Advanced', verified: true, peerCount: 12 },
      { name: 'Pydantic & REST APIs', level: 'Advanced', verified: true, peerCount: 14 },
    ],
    wantsToLearn: [
      { name: 'React & Mobile UI', level: 'Beginner', priority: 'High' },
    ],
    availability: 'Weekdays after 5:00 PM in Library Block B',
    languages: ['English', 'Hindi', 'Marathi'],
    badges: [
      { id: 'b8', name: 'Code Sprint Winner', icon: 'award', date: '2026' },
    ],
    enrolledCourseIds: ['course_web_dev', 'course_dbms'],
  },
  {
    id: 'usr_ananya_iyer',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@bvu.edu.in',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
    department: 'Information Technology',
    year: '2nd Year',
    rollNo: 'BV-23IT029',
    bio: 'IT sophomore passionate about cryptography, network packet analysis, and Python microservices. Active peer mentor in junior labs.',
    karma: 510,
    verifiedSkillsCount: 6,
    mentoringSessionsCount: 15,
    resourcesContributedCount: 6,
    canTeach: [
      { name: 'Cyber Security & Cryptography', level: 'Intermediate', verified: true, peerCount: 18 },
      { name: 'Computer Networks', level: 'Intermediate', verified: true, peerCount: 14 },
    ],
    wantsToLearn: [
      { name: 'Distributed Systems & Raft', level: 'Beginner', priority: 'High' },
    ],
    availability: 'Tue, Thu, Sat 4:00 PM – 6:30 PM',
    languages: ['English', 'Tamil', 'Hindi'],
    badges: [
      { id: 'b9', name: 'Security CTF Finalist', icon: 'shield-check', date: '2026' },
      { id: 'b10', name: 'IT Peer Mentor', icon: 'award', date: '2026' },
    ],
    enrolledCourseIds: ['course_cn', 'course_cyber_sec', 'course_web_dev'],
  },
  {
    id: 'usr_pranav_d',
    name: 'Pranav Deshmukh',
    email: 'pranav.deshmukh@bvu.edu.in',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    department: 'Mechanical Engineering',
    year: '3rd Year',
    rollNo: 'BV-22ME018',
    bio: 'Mechanical & Mechatronics enthusiast working on ROS2 robotics, embedded microcontrollers, and CAD simulation at BVCOE Innovation Hub.',
    karma: 440,
    verifiedSkillsCount: 5,
    mentoringSessionsCount: 11,
    resourcesContributedCount: 4,
    canTeach: [
      { name: 'Embedded Systems & IoT', level: 'Intermediate', verified: true, peerCount: 15 },
      { name: 'Robotics Kinematics', level: 'Intermediate', verified: true, peerCount: 12 },
    ],
    wantsToLearn: [
      { name: 'Deep Learning for Vision', level: 'Beginner', priority: 'High' },
    ],
    availability: 'Mon, Wed 3:00 PM – 5:30 PM (Robotics Lab)',
    languages: ['English', 'Marathi', 'Hindi'],
    badges: [
      { id: 'b11', name: 'RoboCon Team Lead', icon: 'award', date: '2025' },
    ],
    enrolledCourseIds: ['course_embedded', 'course_dsp'],
  },
  {
    id: 'usr_admin_dr_rao',
    name: 'Dr. P. B. Rao',
    email: 'dr.pbrao.admin@bvu.edu.in',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    department: 'Computer Science & Eng.',
    designation: 'Head of Department (HOD) & Academic Admin',
    bio: 'Department Head & Academic Dean at Bharti Vidyapeeth College of Engineering. Oversees course registrations, faculty validation, syllabus updates, and semester exams.',
    karma: 2500,
    verifiedSkillsCount: 20,
    mentoringSessionsCount: 120,
    resourcesContributedCount: 45,
    languages: ['English', 'Hindi', 'Marathi'],
    badges: [
      { id: 'b_admin', name: 'Faculty Dean & HOD', icon: 'shield-check', date: 'Faculty' },
      { id: 'b_board', name: 'Exam Board Controller', icon: 'award', date: 'BVCOE' },
    ],
    enrolledCourseIds: [
      'course_dsa',
      'course_dbms',
      'course_os',
      'course_cn',
      'course_dsp',
      'course_vlsi',
      'course_ml',
      'course_web_dev',
      'course_dist_sys',
      'course_cyber_sec',
      'course_embedded',
    ],
  },
  {
    id: 'usr_admin_anita_kulkarni',
    name: 'Prof. Anita Kulkarni',
    email: 'prof.anita.kulkarni@bvu.edu.in',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    department: 'Information Technology',
    designation: 'Dean of Academic Affairs & Registrar',
    bio: 'Dean of Academic Affairs and Student Registrar at Bharti Vidyapeeth College of Engineering. Manages student course allocations, university affiliation, and departmental exams.',
    karma: 2150,
    verifiedSkillsCount: 18,
    mentoringSessionsCount: 95,
    resourcesContributedCount: 38,
    languages: ['English', 'Hindi', 'Marathi'],
    badges: [
      { id: 'b_reg', name: 'Academic Registrar', icon: 'shield-check', date: 'BVCOE Admin' },
      { id: 'b_coord', name: 'Board Coordinator', icon: 'award', date: '2026' },
    ],
    enrolledCourseIds: [
      'course_dsa',
      'course_dbms',
      'course_os',
      'course_cn',
      'course_web_dev',
      'course_cyber_sec',
      'course_ml',
    ],
  },
];

export const CURRENT_USER = PRESET_USERS[0];

