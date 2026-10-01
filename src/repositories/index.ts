import { localDb, STORES } from '../db/indexedDB';
import {
  AcademicResource,
  Peer,
  Question,
  MentoringSession,
  PracticeTest,
  TestAttempt,
  TestViolation,
  KarmaTransaction,
  HistoryItem,
  PeerDevice,
  SyncChangeRecord,
} from '../types';
import { PRESET_USERS, AppUser } from '../constants/app';
import { INITIAL_PEERS } from '../services/peerService';
import { INITIAL_RESOURCES } from '../services/resourceService';
import { INITIAL_QUESTIONS } from '../services/questionService';
import { INITIAL_SESSIONS } from '../services/sessionService';
import { INITIAL_TESTS } from '../services/testService';
import { INITIAL_HISTORY } from '../services/historyService';
import { logger } from '../utils/logger';

// 1. RESOURCES REPOSITORY
export const resourcesRepository = {
  async getAll(): Promise<AcademicResource[]> {
    const list = await localDb.getAll<AcademicResource>(STORES.RESOURCES);
    if (list.length === 0) {
      await localDb.putBatch(STORES.RESOURCES, INITIAL_RESOURCES);
      return [...INITIAL_RESOURCES];
    }
    return list;
  },

  async getById(id: string): Promise<AcademicResource | null> {
    const item = await localDb.getById<AcademicResource>(STORES.RESOURCES, id);
    if (item) return item;
    const all = await this.getAll();
    return all.find((r) => r.id === id) || null;
  },

  async save(resource: AcademicResource): Promise<AcademicResource> {
    logger.info('RESOURCE', `Saving resource ${resource.title} (${resource.id})`);
    return await localDb.put(STORES.RESOURCES, resource);
  },

  async delete(id: string): Promise<void> {
    logger.info('RESOURCE', `Deleting resource ${id}`);
    await localDb.delete(STORES.RESOURCES, id);
  },

  async getOfflineResources(): Promise<AcademicResource[]> {
    const all = await this.getAll();
    return all.filter((r) => r.isOfflineAvailable);
  },
};

// 2. USERS & PEERS REPOSITORY
export const usersRepository = {
  async getCurrentUser(): Promise<AppUser> {
    const stored = await localDb.getById<AppUser>(STORES.USERS, 'current_user');
    if (stored) return stored;
    const defaultUser = { ...PRESET_USERS[0], id: 'current_user' };
    await localDb.put(STORES.USERS, defaultUser);
    return defaultUser;
  },

  async saveCurrentUser(user: AppUser): Promise<AppUser> {
    logger.info('AUTH', `Saving profile updates for ${user.name}`);
    return await localDb.put(STORES.USERS, { ...user, id: 'current_user' });
  },

  async getAllPeers(): Promise<Peer[]> {
    const peers = await localDb.getAll<Peer>(STORES.PEER_DEVICES);
    if (peers.length === 0) {
      // Map initial peers
      await localDb.putBatch(STORES.PEER_DEVICES, INITIAL_PEERS);
      return [...INITIAL_PEERS];
    }
    return peers;
  },

  async getPeerById(id: string): Promise<Peer | null> {
    const peer = await localDb.getById<Peer>(STORES.PEER_DEVICES, id);
    if (peer) return peer;
    const all = await this.getAllPeers();
    return all.find((p) => p.id === id) || null;
  },
};

// 3. SKILLS REPOSITORY
export interface SkillRecord {
  id: string;
  name: string;
  category: string;
  type: 'teach' | 'learn';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  verified: boolean;
  peerCount: number;
  priority?: string;
}

export const skillsRepository = {
  async getUserSkills(): Promise<SkillRecord[]> {
    const skills = await localDb.getAll<SkillRecord>(STORES.SKILLS);
    if (skills.length === 0) {
      const initial: SkillRecord[] = [
        { id: 'sk_py', name: 'Python', category: 'Programming', type: 'teach', level: 'Advanced', verified: true, peerCount: 22 },
        { id: 'sk_dsa', name: 'Data Structures & Algorithms', category: 'CS Core', type: 'teach', level: 'Intermediate', verified: true, peerCount: 19 },
        { id: 'sk_os', name: 'Operating Systems & Concurrency', category: 'CS Core', type: 'teach', level: 'Intermediate', verified: false, peerCount: 14 },
        { id: 'sk_ui', name: 'UI/UX Design', category: 'Design', type: 'learn', level: 'Beginner', verified: false, peerCount: 0, priority: 'High' },
        { id: 'sk_figma', name: 'Figma Prototyping', category: 'Design', type: 'learn', level: 'Beginner', verified: false, peerCount: 0, priority: 'Medium' },
        { id: 'sk_web3', name: 'Distributed Systems', category: 'Systems', type: 'learn', level: 'Intermediate', verified: false, peerCount: 0, priority: 'High' },
      ];
      await localDb.putBatch(STORES.SKILLS, initial);
      return initial;
    }
    return skills;
  },

  async addSkill(skill: Omit<SkillRecord, 'id'>): Promise<SkillRecord> {
    const newRecord: SkillRecord = {
      ...skill,
      id: `sk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    };
    logger.info('DATABASE', `Adding skill: ${newRecord.name} (${newRecord.type})`);
    return await localDb.put(STORES.SKILLS, newRecord);
  },

  async removeSkill(id: string): Promise<void> {
    logger.info('DATABASE', `Removing skill ${id}`);
    await localDb.delete(STORES.SKILLS, id);
  },
};

// 4. QUESTIONS REPOSITORY
export const questionsRepository = {
  async getAll(): Promise<Question[]> {
    const list = await localDb.getAll<Question>(STORES.QUESTIONS);
    if (list.length === 0) {
      await localDb.putBatch(STORES.QUESTIONS, INITIAL_QUESTIONS);
      return [...INITIAL_QUESTIONS];
    }
    return list;
  },

  async getById(id: string): Promise<Question | null> {
    const item = await localDb.getById<Question>(STORES.QUESTIONS, id);
    if (item) return item;
    const all = await this.getAll();
    return all.find((q) => q.id === id) || null;
  },

  async save(question: Question): Promise<Question> {
    logger.info('DATABASE', `Saving question ${question.title}`);
    return await localDb.put(STORES.QUESTIONS, question);
  },

  async delete(id: string): Promise<void> {
    await localDb.delete(STORES.QUESTIONS, id);
  },
};

// 5. SESSIONS REPOSITORY
export const sessionsRepository = {
  async getAll(): Promise<MentoringSession[]> {
    const list = await localDb.getAll<MentoringSession>(STORES.SESSIONS);
    if (list.length === 0) {
      await localDb.putBatch(STORES.SESSIONS, INITIAL_SESSIONS);
      return [...INITIAL_SESSIONS];
    }
    return list;
  },

  async getById(id: string): Promise<MentoringSession | null> {
    return await localDb.getById<MentoringSession>(STORES.SESSIONS, id);
  },

  async save(session: MentoringSession): Promise<MentoringSession> {
    logger.info('DATABASE', `Saving mentoring session: ${session.topic} (${session.status})`);
    return await localDb.put(STORES.SESSIONS, session);
  },
};

// 6. TESTS & ATTEMPTS REPOSITORY
export const testsRepository = {
  async getAllTests(): Promise<PracticeTest[]> {
    const list = await localDb.getAll<PracticeTest>(STORES.TESTS);
    if (list.length === 0) {
      await localDb.putBatch(STORES.TESTS, INITIAL_TESTS);
      return [...INITIAL_TESTS];
    }
    return list;
  },

  async getTestById(id: string): Promise<PracticeTest | null> {
    const item = await localDb.getById<PracticeTest>(STORES.TESTS, id);
    if (item) return item;
    const all = await this.getAllTests();
    return all.find((t) => t.id === id) || null;
  },

  async getAttempt(id: string): Promise<TestAttempt | null> {
    return await localDb.getById<TestAttempt>(STORES.TEST_ATTEMPTS, id);
  },

  async getActiveAttempt(testId: string): Promise<TestAttempt | null> {
    const all = await localDb.getAll<TestAttempt>(STORES.TEST_ATTEMPTS);
    return all.find((a) => a.testId === testId && !a.isSubmitted) || null;
  },

  async saveAttempt(attempt: TestAttempt): Promise<TestAttempt> {
    logger.info('TEST', `Autosaving test attempt ${attempt.id} for test ${attempt.testId}`, {
      answeredCount: Object.keys(attempt.answers).length,
      violationsCount: attempt.violations.length,
      isSubmitted: attempt.isSubmitted,
    });
    return await localDb.put(STORES.TEST_ATTEMPTS, attempt);
  },

  async logViolation(attemptId: string, violation: TestViolation): Promise<void> {
    const attempt = await this.getAttempt(attemptId);
    if (attempt) {
      attempt.violations.push(violation);
      if (attempt.violations.length >= 2) {
        attempt.integrityStatus = 'Review required';
      } else {
        attempt.integrityStatus = 'Warning issued';
      }
      logger.warn('TEST', `Integrity violation registered: ${violation.type}`, {
        attemptId,
        count: attempt.violations.length,
      });
      await this.saveAttempt(attempt);
    }
  },
};

// 7. KARMA LEDGER REPOSITORY (Append-Only Transaction Ledger)
export const karmaRepository = {
  async getTransactions(userId = 'current_user'): Promise<KarmaTransaction[]> {
    const list = await localDb.getAll<KarmaTransaction>(STORES.KARMA_TRANSACTIONS);
    if (list.length === 0) {
      const initial: KarmaTransaction[] = [
        {
          id: 'kt_1',
          userId,
          amount: 30,
          action: 'completed_session',
          description: 'Completed mentoring session: Relational Normalization with Aarav Sharma',
          timestamp: '2 days ago',
        },
        {
          id: 'kt_2',
          userId,
          amount: 20,
          action: 'accepted_answer',
          description: 'Accepted answer on DBMS Candidate Keys derivation query',
          timestamp: '4 days ago',
        },
        {
          id: 'kt_3',
          userId,
          amount: 15,
          action: 'resource_contribution',
          description: 'Contributed verified DBMS ER Cheat Sheet to campus library',
          timestamp: 'Last week',
        },
        {
          id: 'kt_4',
          userId,
          amount: 10,
          action: 'useful_validation',
          description: 'Peer validation received for Data Structures topic clarification',
          timestamp: '2 weeks ago',
        },
      ];
      await localDb.putBatch(STORES.KARMA_TRANSACTIONS, initial);
      return initial;
    }
    return list.filter((t) => t.userId === userId || userId === 'all');
  },

  async addTransaction(transaction: Omit<KarmaTransaction, 'id' | 'timestamp'>): Promise<KarmaTransaction> {
    const record: KarmaTransaction = {
      ...transaction,
      id: `kt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
    };
    logger.info('DATABASE', `Karma transaction recorded: +${record.amount} (${record.action})`);
    await localDb.put(STORES.KARMA_TRANSACTIONS, record);
    return record;
  },

  async calculateTotal(userId = 'current_user'): Promise<number> {
    const txs = await this.getTransactions(userId);
    return txs.reduce((acc, t) => acc + t.amount, 0);
  },
};

// 8. HISTORY REPOSITORY
export const historyRepository = {
  async getEvents(): Promise<HistoryItem[]> {
    const list = await localDb.getAll<HistoryItem>(STORES.HISTORY_EVENTS);
    if (list.length === 0) {
      await localDb.putBatch(STORES.HISTORY_EVENTS, INITIAL_HISTORY);
      return [...INITIAL_HISTORY];
    }
    return list;
  },

  async addEvent(event: Omit<HistoryItem, 'id'>): Promise<HistoryItem> {
    const item: HistoryItem = {
      ...event,
      id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    };
    logger.info('DATABASE', `History event logged: ${item.title}`);
    return await localDb.put(STORES.HISTORY_EVENTS, item);
  },

  async clear(): Promise<void> {
    logger.info('DATABASE', 'Clearing user history events');
    await localDb.clear(STORES.HISTORY_EVENTS);
  },
};

// 9. SYNC REPOSITORY
export const syncRepository = {
  async getPendingChanges(): Promise<SyncChangeRecord[]> {
    return await localDb.getAll<SyncChangeRecord>(STORES.SYNC_EVENTS);
  },

  async recordChange(record: Omit<SyncChangeRecord, 'eventId' | 'timestamp'>): Promise<SyncChangeRecord> {
    const event: SyncChangeRecord = {
      ...record,
      eventId: `sync_ev_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
    };
    logger.info('SYNC', `Recorded local synchronizable change: ${event.entityType} (${event.operation})`);
    return await localDb.put(STORES.SYNC_EVENTS, event);
  },

  async clearChanges(eventIds: string[]): Promise<void> {
    for (const id of eventIds) {
      await localDb.delete(STORES.SYNC_EVENTS, id);
    }
  },
};
