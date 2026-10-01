import {
  SyncChangeRecord,
  PeerDevice,
  DeviceTrustLevel,
  SyncConflict,
} from '../types';
import { syncRepository, resourcesRepository, usersRepository, karmaRepository } from '../repositories';
import { PeerTransport, LocalBroadcastTransport, TransportMessage } from './peerTransport';
import { logger } from '../utils/logger';

export const SYNC_PROTOCOL_VERSION = 1;

export interface SyncStatus {
  state: 'ONLINE' | 'OFFLINE' | 'LOCAL_NETWORK_AVAILABLE' | 'SYNCING' | 'SYNC_PENDING' | 'SYNC_CONFLICT' | 'SYNC_ERROR';
  discoverablePeers: PeerDevice[];
  pendingChangesCount: number;
  lastSyncedText: string;
  conflicts: SyncConflict[];
}

export type SyncStatusListener = (status: SyncStatus) => void;

class SyncManager {
  private deviceId: string;
  private transport: PeerTransport;
  private listeners: Set<SyncStatusListener> = new Set();
  private state: SyncStatus['state'] = 'ONLINE';
  private peers: Map<string, PeerDevice> = new Map();
  private conflicts: SyncConflict[] = [];
  private lastSyncedAt: Date = new Date();
  private isSyncing = false;

  constructor() {
    this.deviceId = this.getOrCreateDeviceId();
    this.transport = new LocalBroadcastTransport();
  }

  private getOrCreateDeviceId(): string {
    if (typeof window === 'undefined') return 'node_srv_001';
    let id = localStorage.getItem('skillmesh_device_id');
    if (!id) {
      id = `dev_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`;
      localStorage.setItem('skillmesh_device_id', id);
    }
    return id;
  }

  public subscribe(listener: SyncStatusListener): () => void {
    this.listeners.add(listener);
    listener(this.getStatus());
    return () => this.listeners.delete(listener);
  }

  public async init() {
    await this.transport.connect();
    this.transport.onMessage((msg) => this.handleIncomingMessage(msg));

    // Seed mock initial discovered peer devices on LAN
    const initialDevices: PeerDevice[] = [
      {
        id: 'node_pune_01',
        deviceId: 'dev_aarav_sharma',
        studentName: 'Aarav Sharma',
        department: 'Computer Science & Eng.',
        trustLevel: 'trusted',
        lastSeen: 'Just now',
        protocolVersion: SYNC_PROTOCOL_VERSION,
        isOnline: true,
      },
      {
        id: 'node_pune_02',
        deviceId: 'dev_neha_gupta',
        studentName: 'Neha Gupta',
        department: 'Electronics & Comm. (ECE)',
        trustLevel: 'paired',
        lastSeen: '2 mins ago',
        protocolVersion: SYNC_PROTOCOL_VERSION,
        isOnline: true,
      },
      {
        id: 'node_pune_03',
        deviceId: 'dev_priya_patel',
        studentName: 'Priya Patel',
        department: 'Information Technology',
        trustLevel: 'discovered',
        lastSeen: '5 mins ago',
        protocolVersion: SYNC_PROTOCOL_VERSION,
        isOnline: true,
      },
    ];

    initialDevices.forEach((d) => this.peers.set(d.deviceId, d));
    this.notify();
  }

  public getStatus(): SyncStatus {
    const minutesAgo = Math.floor((Date.now() - this.lastSyncedAt.getTime()) / 60000);
    const lastSyncedText = minutesAgo === 0 ? 'Just now' : `${minutesAgo}m ago`;

    return {
      state: this.state,
      discoverablePeers: Array.from(this.peers.values()),
      pendingChangesCount: 0,
      lastSyncedText,
      conflicts: this.conflicts,
    };
  }

  private notify() {
    const status = this.getStatus();
    this.listeners.forEach((l) => l(status));
  }

  public updatePeerTrust(deviceId: string, trustLevel: DeviceTrustLevel) {
    const peer = this.peers.get(deviceId);
    if (peer) {
      peer.trustLevel = trustLevel;
      logger.info('SECURITY', `Peer ${peer.studentName} trust level set to: ${trustLevel}`);
      this.notify();
    }
  }

  public async triggerSync(): Promise<boolean> {
    if (this.isSyncing) return false;
    this.isSyncing = true;
    this.state = 'SYNCING';
    this.notify();

    logger.info('SYNC', 'Starting peer mesh reconciliation cycle...', {
      protocolVersion: SYNC_PROTOCOL_VERSION,
      originDevice: this.deviceId,
    });

    try {
      // 1. Send Handshake Broadcast
      this.transport.send({
        type: 'SYNC_HANDSHAKE_INIT',
        senderId: this.deviceId,
        timestamp: new Date().toISOString(),
        payload: {
          protocolVersion: SYNC_PROTOCOL_VERSION,
          deviceId: this.deviceId,
        },
      });

      // 2. Simulate processing pending changes
      const pending = await syncRepository.getPendingChanges();
      if (pending.length > 0) {
        await syncRepository.clearChanges(pending.map((p) => p.eventId));
      }

      await new Promise((r) => setTimeout(r, 600));

      this.lastSyncedAt = new Date();
      this.state = 'ONLINE';
      logger.info('SYNC', 'Peer mesh reconciliation finished cleanly.');
      return true;
    } catch (err) {
      logger.error('SYNC', 'Sync reconciliation failed', { error: err });
      this.state = 'SYNC_ERROR';
      return false;
    } finally {
      this.isSyncing = false;
      this.notify();
    }
  }

  private handleIncomingMessage(msg: TransportMessage) {
    if (msg.senderId === this.deviceId) return; // Ignore own echoes

    logger.debug('SYNC', `Incoming mesh transport message: ${msg.type}`, { sender: msg.senderId });

    if (msg.type === 'SYNC_HANDSHAKE_INIT') {
      this.transport.send({
        type: 'SYNC_HANDSHAKE_ACK',
        senderId: this.deviceId,
        timestamp: new Date().toISOString(),
        payload: {
          protocolVersion: SYNC_PROTOCOL_VERSION,
          acknowledgedDevice: msg.senderId,
        },
      });
    }
  }
}

export const syncManager = new SyncManager();
