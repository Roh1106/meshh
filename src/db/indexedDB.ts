import { logger } from '../utils/logger';

const DB_NAME = 'skillmesh_db';
const DB_VERSION = 1;

export const STORES = {
  USERS: 'users',
  SKILLS: 'skills',
  RESOURCES: 'resources',
  QUESTIONS: 'questions',
  SESSIONS: 'sessions',
  TESTS: 'tests',
  TEST_ATTEMPTS: 'test_attempts',
  KARMA_TRANSACTIONS: 'karma_transactions',
  HISTORY_EVENTS: 'history_events',
  NOTIFICATIONS: 'notifications',
  SAVED_ITEMS: 'saved_items',
  SYNC_EVENTS: 'sync_events',
  REPORTS: 'reports',
  PEER_DEVICES: 'peer_devices',
} as const;

export type StoreName = (typeof STORES)[keyof typeof STORES];

class LocalDatabase {
  private db: IDBDatabase | null = null;
  private memoryFallback: Map<string, Map<string, unknown>> = new Map();
  private isFallback = false;

  constructor() {
    Object.values(STORES).forEach((name) => {
      this.memoryFallback.set(name, new Map());
    });
  }

  async getDb(): Promise<IDBDatabase | null> {
    if (this.isFallback) return null;
    if (this.db) return this.db;

    if (typeof window === 'undefined' || !window.indexedDB) {
      logger.warn('DATABASE', 'IndexedDB not supported in this runtime environment. Using in-memory fallback.');
      this.isFallback = true;
      return null;
    }

    return new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          Object.values(STORES).forEach((storeName) => {
            if (!db.objectStoreNames.contains(storeName)) {
              db.createObjectStore(storeName, { keyPath: 'id' });
            }
          });
          logger.info('DATABASE', 'IndexedDB upgraded and stores established.', { version: DB_VERSION });
        };

        request.onsuccess = () => {
          this.db = request.result;
          logger.info('DATABASE', 'IndexedDB connection opened successfully.');
          resolve(this.db);
        };

        request.onerror = (err) => {
          logger.error('DATABASE', 'Failed to open IndexedDB. Falling back to memory.', { error: err });
          this.isFallback = true;
          resolve(null);
        };
      } catch (err) {
        logger.error('DATABASE', 'Exception during IndexedDB initialization.', { error: err });
        this.isFallback = true;
        resolve(null);
      }
    });
  }

  async getAll<T>(storeName: StoreName): Promise<T[]> {
    const db = await this.getDb();
    if (!db) {
      const storeMap = this.memoryFallback.get(storeName);
      return Array.from(storeMap?.values() || []) as T[];
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve((req.result || []) as T[]);
        req.onerror = () => reject(req.error);
      } catch (err) {
        logger.error('DATABASE', `Failed to read all from ${storeName}`, { error: err });
        const storeMap = this.memoryFallback.get(storeName);
        resolve(Array.from(storeMap?.values() || []) as T[]);
      }
    });
  }

  async getById<T>(storeName: StoreName, id: string): Promise<T | null> {
    const db = await this.getDb();
    if (!db) {
      const storeMap = this.memoryFallback.get(storeName);
      return (storeMap?.get(id) as T) || null;
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.get(id);
        req.onsuccess = () => resolve((req.result as T) || null);
        req.onerror = () => resolve(null);
      } catch (err) {
        const storeMap = this.memoryFallback.get(storeName);
        resolve((storeMap?.get(id) as T) || null);
      }
    });
  }

  async put<T extends { id: string }>(storeName: StoreName, item: T): Promise<T> {
    // Keep memory fallback in sync
    this.memoryFallback.get(storeName)?.set(item.id, item);

    const db = await this.getDb();
    if (!db) return item;

    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.put(item);
        req.onsuccess = () => resolve(item);
        req.onerror = () => reject(req.error);
      } catch (err) {
        logger.error('DATABASE', `Failed to write to ${storeName}`, { id: item.id, error: err });
        resolve(item);
      }
    });
  }

  async putBatch<T extends { id: string }>(storeName: StoreName, items: T[]): Promise<void> {
    items.forEach((item) => {
      this.memoryFallback.get(storeName)?.set(item.id, item);
    });

    const db = await this.getDb();
    if (!db) return;

    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        items.forEach((item) => store.put(item));
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      } catch (err) {
        resolve();
      }
    });
  }

  async delete(storeName: StoreName, id: string): Promise<void> {
    this.memoryFallback.get(storeName)?.delete(id);

    const db = await this.getDb();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async clear(storeName: StoreName): Promise<void> {
    this.memoryFallback.get(storeName)?.clear();

    const db = await this.getDb();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }
}

export const localDb = new LocalDatabase();
