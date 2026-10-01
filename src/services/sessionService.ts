import { MentoringSession, SessionStatus } from '../types';

export const INITIAL_SESSIONS: MentoringSession[] = [
  {
    id: 'sess_1',
    topic: 'Relational Normalization & Lossless Join Decompositions',
    mentorId: 'p1',
    mentorName: 'Aarav Sharma',
    mentorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkLp7VVctQ7ZRqzUv8Q7JLtJFcX2OhbVdo_CiAy-mUvGTLsghngTUYb2gCmRbMZ47wcjGZGcS2ufGFVFrX10LdaacQTMqU-xKMUxD9_MKi0dsMT79PzqfFg6atG2h6OPwOWFbvctw-XHOWVOPEY7gbn0JlRM2-wLvsABG0ph_oLjLdLtIwBWbg_Xrjg9ybd0NIOWnjboVK4JMDrDS0y-TuQT0CBGBFGOj79b4YY3hJKMprSPSstTYSbg',
    menteeName: 'Rohan Ranmale',
    menteeAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK8O_FLVEHVKGWJwYN720Txxmi2aR44Fftcmp6KUe_aCCcHc1pelyNEjVHEmc2psynsu1VmPAkgcEUMoU4Gw9rnJCl8Aic6HX5IPjEaOMoVsR3C_oT25CccR_KMc14mYqU1zbtstEbJGB_GOFAuVCK9ItPNhNXZzr2gRfDvLT00lgawDC2mKCxoLE8rmY_hywOtBUWeJmtwNLsuh66gitzC_4ztLQP56EF0-4Y8u1KgwCeoVH0Iws03g',
    date: 'Today',
    time: '4:30 PM - 5:30 PM',
    duration: '60 mins',
    location: 'Tech Park Cafe (Table 4)',
    status: 'Scheduled',
    notes: 'Bring previous semester DBMS question paper and BCNF practice questions.',
  },
  {
    id: 'sess_2',
    topic: 'Verilog FSM Synthesis & Testbench Setup',
    mentorId: 'p2',
    mentorName: 'Neha Gupta',
    mentorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd9aCuxM3XzxIggPf8_RXnvfZZkUHH98aRwvTQgFzjbHVWImO3H_FN11PL9--EM0jWAElcFffdSsOhrscHfa_NYRx-VG1xny6CHERhMJWb-A_bjF7Ju0QDRv9QJop9vF5X2KKXLXCg-3uFrLP37yIMze2FXfodafopeiKfwbisP57TQVNxTzkJ3RTEBG_QinC57HgnJs69FixXrGBxoo6ZZawUaxv2k5-kyfLbPAOg_lnRA7zq-WaiNg',
    menteeName: 'Rohan Ranmale',
    menteeAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK8O_FLVEHVKGWJwYN720Txxmi2aR44Fftcmp6KUe_aCCcHc1pelyNEjVHEmc2psynsu1VmPAkgcEUMoU4Gw9rnJCl8Aic6HX5IPjEaOMoVsR3C_oT25CccR_KMc14mYqU1zbtstEbJGB_GOFAuVCK9ItPNhNXZzr2gRfDvLT00lgawDC2mKCxoLE8rmY_hywOtBUWeJmtwNLsuh66gitzC_4ztLQP56EF0-4Y8u1KgwCeoVH0Iws03g',
    date: 'Sep 28, 2026',
    time: '2:00 PM - 3:00 PM',
    duration: '60 mins',
    location: 'ECE Department Lab 2',
    status: 'Completed',
    rating: 5.0,
    notes: 'Covered Mealy vs Moore state diagrams and non-blocking testbench delay assertions.',
  },
  {
    id: 'sess_3',
    topic: 'FastAPI Dependency Injection & SQLite Async Session Walkthrough',
    mentorId: 'p3',
    mentorName: 'Siddharth Mehta',
    mentorAvatar: '',
    menteeName: 'Rohan Ranmale',
    menteeAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK8O_FLVEHVKGWJwYN720Txxmi2aR44Fftcmp6KUe_aCCcHc1pelyNEjVHEmc2psynsu1VmPAkgcEUMoU4Gw9rnJCl8Aic6HX5IPjEaOMoVsR3C_oT25CccR_KMc14mYqU1zbtstEbJGB_GOFAuVCK9ItPNhNXZzr2gRfDvLT00lgawDC2mKCxoLE8rmY_hywOtBUWeJmtwNLsuh66gitzC_4ztLQP56EF0-4Y8u1KgwCeoVH0Iws03g',
    date: 'Oct 02, 2026',
    time: '6:00 PM - 7:00 PM',
    duration: '60 mins',
    location: 'Library Block B (Room 3)',
    status: 'Requested',
    notes: 'Peer skill swap: Siddharth requested help with React hooks in return.',
  },
];

class SessionService {
  private sessions: MentoringSession[] = [...INITIAL_SESSIONS];

  async getSessions(statusFilter?: SessionStatus | 'All'): Promise<MentoringSession[]> {
    await new Promise((r) => setTimeout(r, 70));
    if (!statusFilter || statusFilter === 'All') return this.sessions;
    return this.sessions.filter((s) => s.status === statusFilter);
  }

  async getSessionById(id: string): Promise<MentoringSession | undefined> {
    await new Promise((r) => setTimeout(r, 60));
    return this.sessions.find((s) => s.id === id);
  }

  async requestSession(data: {
    mentorId: string;
    mentorName: string;
    mentorAvatar: string;
    topic: string;
    date: string;
    time: string;
    location: string;
    notes?: string;
  }): Promise<MentoringSession> {
    const newSession: MentoringSession = {
      id: `sess_${Date.now()}`,
      topic: data.topic,
      mentorId: data.mentorId,
      mentorName: data.mentorName,
      mentorAvatar: data.mentorAvatar,
      menteeName: 'Rohan Ranmale',
      menteeAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK8O_FLVEHVKGWJwYN720Txxmi2aR44Fftcmp6KUe_aCCcHc1pelyNEjVHEmc2psynsu1VmPAkgcEUMoU4Gw9rnJCl8Aic6HX5IPjEaOMoVsR3C_oT25CccR_KMc14mYqU1zbtstEbJGB_GOFAuVCK9ItPNhNXZzr2gRfDvLT00lgawDC2mKCxoLE8rmY_hywOtBUWeJmtwNLsuh66gitzC_4ztLQP56EF0-4Y8u1KgwCeoVH0Iws03g',
      date: data.date,
      time: data.time,
      duration: '45 mins',
      location: data.location,
      status: 'Requested',
      notes: data.notes,
    };
    this.sessions.unshift(newSession);
    return newSession;
  }
}

export const sessionService = new SessionService();
