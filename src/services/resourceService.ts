import { AcademicResource } from '../types';

export const INITIAL_RESOURCES: AcademicResource[] = [
  {
    id: 'res_dbms_cheat_sheet',
    title: 'Database Systems: Normalized ER Cheat Sheet',
    subject: 'Database Management Systems (DBMS)',
    topic: 'Relational Normalization & ER Diagrams',
    format: 'PDF',
    fileSize: '1.8 MB',
    semester: 'Semester 4',
    department: 'Computer Science & Eng.',
    language: 'English',
    verified: true,
    verifiedBy: 'Prof. Rao Approved',
    rating: 4.9,
    ratingsCount: 62,
    downloadCount: 128,
    author: 'Aarav Sharma & DBMS Study Circle',
    authorRole: 'Senior Peer Tutor',
    updatedAt: '2 days ago',
    description:
      'Complete quick-reference for BCNF, 3NF, functional dependencies, canonical covers, and relational calculus with worked university question paper examples.',
    isSaved: true,
    isOfflineAvailable: true,
  },
  {
    id: 'res_os_cpu_scheduling',
    title: 'Operating Systems — CPU Scheduling & Deadlock Avoidance',
    subject: 'Operating Systems',
    topic: 'Process Scheduling Algorithms & Banker Algorithm',
    format: 'PDF',
    fileSize: '2.4 MB',
    semester: 'Semester 3',
    department: 'Computer Science & Eng.',
    language: 'English',
    verified: true,
    verifiedBy: 'Prof. Mukherjee Approved',
    rating: 4.7,
    ratingsCount: 38,
    downloadCount: 89,
    author: 'Priya Patel',
    authorRole: 'OS Teaching Assistant',
    updatedAt: 'Last week',
    description:
      'Step-by-step Gantt chart solutions for Round Robin, SJF, Multilevel Feedback Queue, and resource allocation graphs with safety checks.',
    isSaved: false,
    isOfflineAvailable: false,
  },
  {
    id: 'res_cn_subnetting',
    title: 'Computer Networks: CIDR Subnetting & Packet Flow Matrix',
    subject: 'Computer Networks',
    topic: 'IPv4/IPv6 Addressing, Subnet Masks & ARP',
    format: 'PDF',
    fileSize: '950 KB',
    semester: 'Semester 4',
    department: 'Information Technology',
    language: 'English',
    verified: true,
    verifiedBy: 'Dept. Lab Verified',
    rating: 4.8,
    ratingsCount: 45,
    downloadCount: 94,
    author: 'Vikram Sen',
    updatedAt: '3 days ago',
    description:
      'Visual subnet calculator cheat sheet, VLSM breakdown diagrams, and Wireshark trace annotations for TCP 3-way handshakes.',
    isSaved: false,
    isOfflineAvailable: true,
  },
  {
    id: 'res_dsp_verilog_templates',
    title: 'Synthesizable Verilog HDL Templates & Testbenches',
    subject: 'Digital System Design',
    topic: 'FSMs, ALU Design & Testbenches',
    format: 'ZIP',
    fileSize: '3.1 MB',
    semester: 'Semester 5',
    department: 'Electronics & Comm. (ECE)',
    language: 'Verilog / VHDL',
    verified: true,
    verifiedBy: 'Prof. Iyer Approved',
    rating: 4.9,
    ratingsCount: 29,
    downloadCount: 57,
    author: 'Neha Gupta',
    authorRole: 'ECE Dept Rank 3',
    updatedAt: '5 days ago',
    description:
      'Ready-to-simulate behavioral and structural Verilog code for Mealy/Moore finite state machines, clock dividers, and pipelined adders.',
    isSaved: false,
    isOfflineAvailable: false,
  },
  {
    id: 'res_math_graph_theory',
    title: 'Discrete Mathematics: Graph Theory Proofs & Tree Traversal',
    subject: 'Discrete Mathematical Structures',
    topic: 'Eulerian Paths, Planar Graphs & Chromatic Numbers',
    format: 'NOTES',
    fileSize: '1.2 MB',
    semester: 'Semester 3',
    department: 'Computer Science & Eng.',
    language: 'English',
    verified: false,
    rating: 4.6,
    ratingsCount: 22,
    downloadCount: 51,
    author: 'Ananya Roy',
    updatedAt: '2 weeks ago',
    description:
      'Concise handwritten digitized proofs, handshaking theorem derivations, Dijkstra proofs, and adjacency matrix problem sets.',
    isSaved: false,
    isOfflineAvailable: false,
  },
];

class ResourceService {
  private resources: AcademicResource[] = [...INITIAL_RESOURCES];

  async getResources(params?: {
    query?: string;
    department?: string;
    format?: string;
    offlineOnly?: boolean;
    verifiedOnly?: boolean;
  }): Promise<AcademicResource[]> {
    await new Promise((r) => setTimeout(r, 70));

    return this.resources.filter((res) => {
      if (params?.query) {
        const q = params.query.toLowerCase();
        const matchesTitle = res.title.toLowerCase().includes(q);
        const matchesSubj = res.subject.toLowerCase().includes(q);
        const matchesTopic = res.topic.toLowerCase().includes(q);
        const matchesAuthor = res.author.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSubj && !matchesTopic && !matchesAuthor) return false;
      }

      if (params?.department && params.department !== 'All Departments') {
        if (!res.department.toLowerCase().includes(params.department.toLowerCase())) return false;
      }

      if (params?.format && params.format !== 'All Formats') {
        if (res.format !== params.format) return false;
      }

      if (params?.offlineOnly && !res.isOfflineAvailable) {
        return false;
      }

      if (params?.verifiedOnly && !res.verified) {
        return false;
      }

      return true;
    });
  }

  async getResourceById(id: string): Promise<AcademicResource | undefined> {
    await new Promise((r) => setTimeout(r, 60));
    return this.resources.find((r) => r.id === id);
  }

  async toggleOfflineSave(resourceId: string): Promise<boolean> {
    const res = this.resources.find((r) => r.id === resourceId);
    if (res) {
      res.isOfflineAvailable = !res.isOfflineAvailable;
      if (res.isOfflineAvailable) {
        res.downloadCount += 1;
      }
      return res.isOfflineAvailable;
    }
    return false;
  }

  async toggleBookmark(resourceId: string): Promise<boolean> {
    const res = this.resources.find((r) => r.id === resourceId);
    if (res) {
      res.isSaved = !res.isSaved;
      return res.isSaved;
    }
    return false;
  }
}

export const resourceService = new ResourceService();
