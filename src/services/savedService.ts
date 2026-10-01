import { SavedItem } from '../types';

export const INITIAL_SAVED_ITEMS: SavedItem[] = [
  {
    id: 's1',
    originalId: 'res_dbms_cheat_sheet',
    type: 'resource',
    title: 'Database Systems: Normalized ER Cheat Sheet',
    subtitle: 'PDF (1.8 MB) · Prof. Rao Approved · 4.9 ★',
    savedAt: 'Today',
    metadata: 'Computer Science & Eng. · Semester 4',
  },
  {
    id: 's2',
    originalId: 'p2',
    type: 'peer',
    title: 'Neha Gupta (Dept Rank 3)',
    subtitle: 'Can Teach: DSP, Verilog · Wants: Python Data Science',
    savedAt: 'Yesterday',
    metadata: 'ECE · 3rd Year · Available Tomorrow',
  },
  {
    id: 's3',
    originalId: 'q1',
    type: 'question',
    title: 'How to accurately compute candidate keys in 3NF?',
    subtitle: 'DBMS · Normalization · Solved · 3 answers',
    savedAt: '2 days ago',
    metadata: 'Asked by Rohan Ranmale',
  },
  {
    id: 's4',
    originalId: 'sess_1',
    type: 'session',
    title: 'Upcoming Mentoring: Relational Normalization with Aarav Sharma',
    subtitle: 'Today at 4:30 PM · Tech Park Cafe',
    savedAt: '3 days ago',
    metadata: 'Duration: 60 mins · Scheduled',
  },
];

class SavedService {
  private savedItems: SavedItem[] = [...INITIAL_SAVED_ITEMS];

  async getSavedItems(typeFilter?: 'all' | 'resource' | 'question' | 'peer' | 'session'): Promise<SavedItem[]> {
    await new Promise((r) => setTimeout(r, 60));
    if (!typeFilter || typeFilter === 'all') return [...this.savedItems];
    return this.savedItems.filter((item) => item.type === typeFilter);
  }

  async removeItem(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 50));
    this.savedItems = this.savedItems.filter((i) => i.id !== id);
  }
}

export const savedService = new SavedService();
