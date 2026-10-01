import { Peer, SkillSwapListing } from '../types';

export const INITIAL_PEERS: Peer[] = [
  {
    id: 'p1',
    name: 'Aarav Sharma',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkLp7VVctQ7ZRqzUv8Q7JLtJFcX2OhbVdo_CiAy-mUvGTLsghngTUYb2gCmRbMZ47wcjGZGcS2ufGFVFrX10LdaacQTMqU-xKMUxD9_MKi0dsMT79PzqfFg6atG2h6OPwOWFbvctw-XHOWVOPEY7gbn0JlRM2-wLvsABG0ph_oLjLdLtIwBWbg_Xrjg9ybd0NIOWnjboVK4JMDrDS0y-TuQT0CBGBFGOj79b4YY3hJKMprSPSstTYSbg',
    department: 'Computer Science & Eng.',
    year: '4th Year',
    roleTag: 'Tutor',
    rating: 4.95,
    sessionCount: 28,
    verified: true,
    skills: ['Algorithms', 'C++', 'Distributed Systems', 'Graph Theory', 'Dynamic Programming'],
    canTeach: ['Algorithms', 'C++', 'Distributed Systems'],
    wantsToLearn: ['Rust', 'GPU Shaders', 'WebAssembly'],
    availability: 'Available Today, 4:00 - 6:00 PM',
    location: 'Tech Park Cafe',
    bio: 'ACM ICPC Regional finalist and 4th-year peer mentor. Focusing on algorithmic proofs and distributed consensus.',
    isSaved: false,
  },
  {
    id: 'p2',
    name: 'Neha Gupta',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd9aCuxM3XzxIggPf8_RXnvfZZkUHH98aRwvTQgFzjbHVWImO3H_FN11PL9--EM0jWAElcFffdSsOhrscHfa_NYRx-VG1xny6CHERhMJWb-A_bjF7Ju0QDRv9QJop9vF5X2KKXLXCg-3uFrLP37yIMze2FXfodafopeiKfwbisP57TQVNxTzkJ3RTEBG_QinC57HgnJs69FixXrGBxoo6ZZawUaxv2k5-kyfLbPAOg_lnRA7zq-WaiNg',
    department: 'Electronics & Comm. (ECE)',
    year: '3rd Year',
    roleTag: 'Dept Rank 3',
    rating: 4.80,
    sessionCount: 14,
    verified: true,
    skills: ['DSP', 'Verilog', 'Circuit Design', 'Microcontrollers', 'Signals'],
    canTeach: ['DSP', 'Verilog', 'Circuit Design'],
    wantsToLearn: ['Python for Data Science / Pandas', 'Machine Learning basics'],
    availability: 'Tomorrow, 2:00 - 5:00 PM',
    location: 'Hardware Prototyping Lab (Block C)',
    bio: 'Specializing in FPGA synthesis and embedded signal processing. Looking to learn Python data pipelines for sensor telemetry.',
    isSaved: true,
  },
  {
    id: 'p3',
    name: 'Siddharth Mehta',
    avatar: '',
    department: 'Computer Science & Eng.',
    year: '4th Year',
    roleTag: 'Mentor',
    rating: 4.90,
    sessionCount: 19,
    verified: true,
    skills: ['FastAPI', 'Python', 'SQLite', 'REST APIs', 'Docker'],
    canTeach: ['FastAPI Backend Architecture', 'Pydantic', 'AsyncIO'],
    wantsToLearn: ['React & Mobile UI', 'CSS Grid', 'Tailwind'],
    availability: 'Available Today, 5:30 - 7:30 PM',
    location: 'Library Block B (Quiet Study Room 3)',
    bio: 'Backend enthusiast building lightweight offline-first campus utilities with FastAPI and SQLite.',
    isSaved: false,
  },
  {
    id: 'p4',
    name: 'Priya Patel',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK8O_FLVEHVKGWJwYN720Txxmi2aR44Fftcmp6KUe_aCCcHc1pelyNEjVHEmc2psynsu1VmPAkgcEUMoU4Gw9rnJCl8Aic6HX5IPjEaOMoVsR3C_oT25CccR_KMc14mYqU1zbtstEbJGB_GOFAuVCK9ItPNhNXZzr2gRfDvLT00lgawDC2mKCxoLE8rmY_hywOtBUWeJmtwNLsuh66gitzC_4ztLQP56EF0-4Y8u1KgwCeoVH0Iws03g',
    department: 'Information Technology',
    year: '3rd Year',
    roleTag: 'Dept Rank 1',
    rating: 4.98,
    sessionCount: 34,
    verified: true,
    skills: ['Computer Networks', 'Operating Systems', 'Linux Kernel', 'Wireshark'],
    canTeach: ['Computer Networks (TCP/IP)', 'OS Process Scheduling'],
    wantsToLearn: ['Cloud Native Go', 'Kubernetes'],
    availability: 'Thursdays & Fridays, 3:00 - 6:00 PM',
    location: 'Central Library Floor 2',
    bio: 'Passionate about protocol design, socket programming, and OS concurrency primitives.',
    isSaved: false,
  },
  {
    id: 'p5',
    name: 'Karan Varma',
    avatar: '',
    department: 'Mechanical Engineering',
    year: '2nd Year',
    roleTag: 'Tutor',
    rating: 4.65,
    sessionCount: 8,
    verified: false,
    skills: ['Engineering Mechanics', 'CAD / SolidWorks', 'Thermodynamics'],
    canTeach: ['Engineering Mechanics Statics', 'SolidWorks 3D Modeling'],
    wantsToLearn: ['Python for Engineering Math', 'Matplotlib'],
    availability: 'Weekends, 10:00 AM - 1:00 PM',
    location: 'Workshop Block CAD Suite',
    bio: 'Helping first and second years clear fundamental mechanics and statics assignments.',
    isSaved: false,
  },
];

export const INITIAL_SWAPS: SkillSwapListing[] = [
  {
    id: 'swap1',
    authorId: 'p3',
    authorName: 'Siddharth M.',
    authorMeta: '4th Year CSE · Posted 2 hours ago',
    timeAgo: '2 hours ago',
    location: 'Library Block B',
    title: 'FastAPI Backend Architecture & Pydantic',
    description:
      'Offering 1-on-1 practical walkthrough of production REST APIs, dependency injection, and SQLite/PostgreSQL connectors.',
    seekingSkill: 'React & Mobile UI Help for capstone app',
    interestedCount: 4,
    interestedAvatars: ['AK', 'RP', 'VS'],
    tag: '4 Interested',
  },
  {
    id: 'swap2',
    authorId: 'p2',
    authorName: 'Neha Gupta',
    authorMeta: '3rd Year ECE · Posted today',
    timeAgo: 'Today',
    location: 'ECE Department Lab 3',
    title: 'DSP Filter Design & Verilog Testbenches',
    description:
      'Can mentor in FIR/IIR digital filter design and writing self-checking Verilog testbenches for semester 5 lab exam.',
    seekingSkill: 'Python Pandas & NumPy analysis',
    interestedCount: 3,
    interestedAvatars: ['SM', 'RR', 'DK'],
    tag: '3 Interested',
  },
];

class PeerService {
  private peers: Peer[] = [...INITIAL_PEERS];
  private swaps: SkillSwapListing[] = [...INITIAL_SWAPS];

  async getPeers(params?: {
    query?: string;
    department?: string;
    year?: string;
    verifiedOnly?: boolean;
    availableToday?: boolean;
  }): Promise<Peer[]> {
    // Simulate brief local IndexedDB / cached retrieval (100ms)
    await new Promise((r) => setTimeout(r, 80));

    return this.peers.filter((peer) => {
      if (params?.query) {
        const q = params.query.toLowerCase();
        const matchesName = peer.name.toLowerCase().includes(q);
        const matchesDept = peer.department.toLowerCase().includes(q);
        const matchesSkill = peer.skills.some((s) => s.toLowerCase().includes(q));
        if (!matchesName && !matchesDept && !matchesSkill) return false;
      }

      if (params?.department && params.department !== 'All Departments') {
        if (!peer.department.toLowerCase().includes(params.department.toLowerCase())) {
          return false;
        }
      }

      if (params?.year && params.year !== 'All Years') {
        if (peer.year !== params.year) return false;
      }

      if (params?.verifiedOnly && !peer.verified) {
        return false;
      }

      if (params?.availableToday && !peer.availability.toLowerCase().includes('today')) {
        return false;
      }

      return true;
    });
  }

  async getPeerById(id: string): Promise<Peer | undefined> {
    await new Promise((r) => setTimeout(r, 50));
    return this.peers.find((p) => p.id === id);
  }

  async getSkillSwaps(): Promise<SkillSwapListing[]> {
    await new Promise((r) => setTimeout(r, 60));
    return this.swaps;
  }

  async toggleSavePeer(peerId: string): Promise<boolean> {
    const peer = this.peers.find((p) => p.id === peerId);
    if (peer) {
      peer.isSaved = !peer.isSaved;
      return peer.isSaved;
    }
    return false;
  }
}

export const peerService = new PeerService();
