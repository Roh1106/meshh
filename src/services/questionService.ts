import { Question } from '../types';

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q1',
    title: 'How to accurately compute candidate keys when attribute closures overlap in 3NF?',
    description:
      'In our DBMS midterm prep, I am confused about relations where multiple minimal candidate keys share prime attributes. How do we test if an FD violates 3NF without generating the entire power set?',
    tags: ['DBMS', 'Normalization', 'Relational-Algebra', '3NF'],
    authorName: 'Rohan Ranmale',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK8O_FLVEHVKGWJwYN720Txxmi2aR44Fftcmp6KUe_aCCcHc1pelyNEjVHEmc2psynsu1VmPAkgcEUMoU4Gw9rnJCl8Aic6HX5IPjEaOMoVsR3C_oT25CccR_KMc14mYqU1zbtstEbJGB_GOFAuVCK9ItPNhNXZzr2gRfDvLT00lgawDC2mKCxoLE8rmY_hywOtBUWeJmtwNLsuh66gitzC_4ztLQP56EF0-4Y8u1KgwCeoVH0Iws03g',
    authorYear: '3rd Year',
    department: 'Computer Science & Eng.',
    answersCount: 3,
    isSolved: true,
    usefulVotes: 14,
    createdAt: 'Yesterday',
    isSaved: true,
    answers: [
      {
        id: 'ans_1',
        authorName: 'Aarav Sharma',
        authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkLp7VVctQ7ZRqzUv8Q7JLtJFcX2OhbVdo_CiAy-mUvGTLsghngTUYb2gCmRbMZ47wcjGZGcS2ufGFVFrX10LdaacQTMqU-xKMUxD9_MKi0dsMT79PzqfFg6atG2h6OPwOWFbvctw-XHOWVOPEY7gbn0JlRM2-wLvsABG0ph_oLjLdLtIwBWbg_Xrjg9ybd0NIOWnjboVK4JMDrDS0y-TuQT0CBGBFGOj79b4YY3hJKMprSPSstTYSbg',
        authorDepartment: 'Computer Science (4th Year)',
        createdAt: 'Yesterday at 6:30 PM',
        isAccepted: true,
        votes: 12,
        content:
          'Great question! For 3NF, remember the definition: for every non-trivial functional dependency X -> A, either X is a superkey OR A is a prime attribute (part of ANY candidate key). First, find attributes that never appear on the right side of any FD—they MUST be part of every candidate key. Compute closure starting with those essential attributes. If closure covers all attributes, you have found your minimal key directly.',
      },
      {
        id: 'ans_2',
        authorName: 'Priya Patel',
        authorAvatar: '',
        authorDepartment: 'IT (3rd Year)',
        createdAt: 'Yesterday at 8:15 PM',
        isAccepted: false,
        votes: 4,
        content:
          'Also check Prof. Rao\'s Normalized ER cheat sheet in the Resources tab! Page 3 has a decision tree for checking 3NF vs BCNF violations in 3 steps.',
      },
    ],
  },
  {
    id: 'q2',
    title: 'Why does race condition happen with blocking assignments (=) in Verilog sequential blocks?',
    description:
      'Our lab instructor insists on always using non-blocking (<=) inside `always @(posedge clk)`. Can someone explain the exact simulation delta cycle behavior that causes races with `=`?',
    tags: ['Verilog', 'Digital-Electronics', 'ECE', 'FPGA'],
    authorName: 'Aditya Deshmukh',
    authorAvatar: '',
    authorYear: '2nd Year',
    department: 'Electronics & Comm. (ECE)',
    answersCount: 2,
    isSolved: true,
    usefulVotes: 9,
    createdAt: '2 days ago',
    isSaved: false,
    answers: [
      {
        id: 'ans_3',
        authorName: 'Neha Gupta',
        authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd9aCuxM3XzxIggPf8_RXnvfZZkUHH98aRwvTQgFzjbHVWImO3H_FN11PL9--EM0jWAElcFffdSsOhrscHfa_NYRx-VG1xny6CHERhMJWb-A_bjF7Ju0QDRv9QJop9vF5X2KKXLXCg-3uFrLP37yIMze2FXfodafopeiKfwbisP57TQVNxTzkJ3RTEBG_QinC57HgnJs69FixXrGBxoo6ZZawUaxv2k5-kyfLbPAOg_lnRA7zq-WaiNg',
        authorDepartment: 'ECE Dept Rank 3',
        createdAt: '2 days ago',
        isAccepted: true,
        votes: 8,
        content:
          'In Verilog, standard `=` assignments execute in the active event region immediately. If two flip-flops trigger on the same clock edge and one reads what the other writes, simulator execution order is non-deterministic. Non-blocking `<=` evaluates the RHS in the active region but schedules the LHS assignment in the NBA (Non-Blocking Assignment) region after all evaluations, preventing the race.',
      },
    ],
  },
  {
    id: 'q3',
    title: 'Understanding Banker’s algorithm safety test complexity in multicore operating systems',
    description:
      'Is Banker algorithm actually deployed in production OS like Linux or FreeBSD, or is it strictly an academic teaching model due to O(m*n^2) worst case?',
    tags: ['Operating-Systems', 'Concurrency', 'Algorithms'],
    authorName: 'Vikram Sen',
    authorAvatar: '',
    authorYear: '3rd Year',
    department: 'Information Technology',
    answersCount: 1,
    isSolved: false,
    usefulVotes: 6,
    createdAt: '3 days ago',
    isSaved: false,
  },
];

class QuestionService {
  private questions: Question[] = [...INITIAL_QUESTIONS];

  async getQuestions(params?: { query?: string; tag?: string; solvedOnly?: boolean }): Promise<Question[]> {
    await new Promise((r) => setTimeout(r, 70));
    return this.questions.filter((q) => {
      if (params?.query) {
        const query = params.query.toLowerCase();
        const matchesTitle = q.title.toLowerCase().includes(query);
        const matchesDesc = q.description.toLowerCase().includes(query);
        const matchesTags = q.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesTags) return false;
      }
      if (params?.tag && !q.tags.includes(params.tag)) return false;
      if (params?.solvedOnly && !q.isSolved) return false;
      return true;
    });
  }

  async getQuestionById(id: string): Promise<Question | undefined> {
    await new Promise((r) => setTimeout(r, 60));
    return this.questions.find((q) => q.id === id);
  }

  async toggleUsefulVote(id: string): Promise<number> {
    const q = this.questions.find((item) => item.id === id);
    if (q) {
      q.usefulVotes += 1;
      return q.usefulVotes;
    }
    return 0;
  }

  async addQuestion(newQ: Omit<Question, 'id' | 'createdAt' | 'answersCount' | 'usefulVotes' | 'isSolved'>): Promise<Question> {
    const created: Question = {
      ...newQ,
      id: `q_${Date.now()}`,
      createdAt: 'Just now',
      answersCount: 0,
      usefulVotes: 0,
      isSolved: false,
      answers: [],
    };
    this.questions.unshift(created);
    return created;
  }
}

export const questionService = new QuestionService();
