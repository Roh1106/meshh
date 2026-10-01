import { HistoryItem } from '../types';

export const INITIAL_HISTORY: HistoryItem[] = [
  {
    id: 'h1',
    type: 'viewed_resource',
    title: 'Viewed Database Systems: Normalized ER Cheat Sheet',
    timestamp: 'Today at 10:14 AM',
    dateGroup: 'Today',
    status: 'Saved Offline',
    link: '/resources/res_dbms_cheat_sheet',
    details: 'Downloaded PDF 1.8 MB to local storage',
  },
  {
    id: 'h2',
    type: 'sync_event',
    title: 'Campus Mesh sync completed',
    timestamp: 'Today at 8:45 AM',
    dateGroup: 'Today',
    status: '14 peers linked',
    details: 'Synced course notes and peer availability via local beacon',
  },
  {
    id: 'h3',
    type: 'mentoring_session',
    title: 'Completed mentoring session with Neha Gupta',
    timestamp: 'Yesterday at 3:00 PM',
    dateGroup: 'Yesterday',
    status: '5.0 ★ Rated',
    link: '/sessions',
    details: 'Topic: Verilog FSM Synthesis & Testbench Setup',
  },
  {
    id: 'h4',
    type: 'asked_question',
    title: 'Asked: How to accurately compute candidate keys in 3NF?',
    timestamp: 'Yesterday at 11:20 AM',
    dateGroup: 'Yesterday',
    status: '3 answers received',
    link: '/questions/q1',
  },
  {
    id: 'h5',
    type: 'attempted_test',
    title: 'Attempted Practice Test: DBMS Normalization',
    timestamp: 'Sep 27, 2026',
    dateGroup: 'This week',
    status: 'Score: 80%',
    link: '/tests/test_dbms_norm',
  },
  {
    id: 'h6',
    type: 'uploaded_resource',
    title: 'Shared Python Algorithm Notes (Binary Search & DP)',
    timestamp: 'Sep 24, 2026',
    dateGroup: 'Older',
    status: 'Verified',
    details: '34 peers downloaded',
  },
];

class HistoryService {
  private history: HistoryItem[] = [...INITIAL_HISTORY];

  async getHistory(): Promise<HistoryItem[]> {
    await new Promise((r) => setTimeout(r, 60));
    return [...this.history];
  }

  async clearHistory(): Promise<void> {
    await new Promise((r) => setTimeout(r, 100));
    this.history = [];
  }
}

export const historyService = new HistoryService();
