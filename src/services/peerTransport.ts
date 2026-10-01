import { logger } from '../utils/logger';

export interface TransportMessage {
  type: string;
  senderId: string;
  timestamp: string;
  payload: unknown;
}

export type MessageHandler = (message: TransportMessage) => void;

export interface PeerTransport {
  name: string;
  connect(url?: string): Promise<boolean>;
  disconnect(): void;
  send(message: TransportMessage): boolean;
  onMessage(handler: MessageHandler): () => void;
  isConnected(): boolean;
}

export class WebSocketTransport implements PeerTransport {
  public name = 'WebSocketTransport';
  private ws: WebSocket | null = null;
  private handlers: Set<MessageHandler> = new Set();
  private connected = false;

  async connect(url = 'ws://localhost:8000/ws/mesh'): Promise<boolean> {
    if (typeof window === 'undefined' || !window.WebSocket) return false;

    return new Promise((resolve) => {
      try {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          this.connected = true;
          logger.info('NETWORK', `WebSocket transport connected to ${url}`);
          resolve(true);
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handlers.forEach((h) => h(data));
          } catch (err) {
            logger.warn('NETWORK', 'Failed to parse incoming WebSocket message', { error: err });
          }
        };

        this.ws.onerror = (err) => {
          logger.warn('NETWORK', 'WebSocket connection failed, falling back to local mesh broadcast', { error: err });
          this.connected = false;
          resolve(false);
        };

        this.ws.onclose = () => {
          this.connected = false;
          logger.info('NETWORK', 'WebSocket transport disconnected');
        };
      } catch (err) {
        this.connected = false;
        resolve(false);
      }
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connected = false;
  }

  send(message: TransportMessage): boolean {
    if (!this.ws || !this.connected) return false;
    try {
      this.ws.send(JSON.stringify(message));
      return true;
    } catch {
      return false;
    }
  }

  onMessage(handler: MessageHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  isConnected(): boolean {
    return this.connected;
  }
}

/**
 * Local BroadcastChannel-based mesh transport for inter-tab & local device simulation.
 */
export class LocalBroadcastTransport implements PeerTransport {
  public name = 'LocalBroadcastTransport';
  private channel: BroadcastChannel | null = null;
  private handlers: Set<MessageHandler> = new Set();
  private connected = false;

  async connect(channelName = 'skillmesh_lan'): Promise<boolean> {
    if (typeof window === 'undefined' || !window.BroadcastChannel) {
      this.connected = true;
      return true;
    }

    try {
      this.channel = new BroadcastChannel(channelName);
      this.channel.onmessage = (event) => {
        this.handlers.forEach((h) => h(event.data));
      };
      this.connected = true;
      logger.info('NETWORK', `LocalBroadcastTransport connected on channel: ${channelName}`);
      return true;
    } catch {
      this.connected = false;
      return false;
    }
  }

  disconnect() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    this.connected = false;
  }

  send(message: TransportMessage): boolean {
    if (!this.channel) return false;
    try {
      this.channel.postMessage(message);
      return true;
    } catch {
      return false;
    }
  }

  onMessage(handler: MessageHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  isConnected(): boolean {
    return this.connected;
  }
}
