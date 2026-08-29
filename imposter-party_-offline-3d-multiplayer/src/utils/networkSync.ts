import { AvatarType, Role } from '../types/game';
import { Peer, DataConnection } from 'peerjs';

export interface NetworkPlayer {
  id: string;
  name: string;
  avatar: AvatarType;
  isHost: boolean;
  role: Role;
  secretWord: string;
  categoryName: string;
  hasVoted: boolean;
  votedForId: string | null;
  score: number;
  roundScoreDelta: number;
  isLocalBot?: boolean;
}

export type NetworkMessageType =
  | 'JOIN_REQUEST'
  | 'JOIN_ACCEPTED'
  | 'JOIN_REJECTED'
  | 'LOBBY_UPDATE'
  | 'START_GAME'
  | 'VIEWED_CARD'
  | 'CHAT_MESSAGE'
  | 'CAST_VOTE'
  | 'TALLY_VOTES'
  | 'NEXT_ROUND'
  | 'PHASE_CHANGE'
  | 'HOST_LEFT'
  | 'HEARTBEAT';

export interface NetworkMessage {
  type: NetworkMessageType;
  senderId: string;
  senderName: string;
  senderAvatar?: AvatarType;
  roomCode: string;
  payload?: any;
  timestamp?: number;
}

export type NetworkStateListener = (msg: NetworkMessage) => void;

class LocalNetworkHub {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  private hostConnection: DataConnection | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private listeners: Set<NetworkStateListener> = new Set();
  private currentRoomCode: string = '';
  private isHost: boolean = false;
  private myPlayerId: string = '';
  private storageListener: ((e: StorageEvent) => void) | null = null;

  constructor() {
    // Initialized when joining or hosting
  }

  public getRoomCode(): string {
    return this.currentRoomCode;
  }

  public getMyPlayerId(): string {
    return this.myPlayerId;
  }

  public subscribe(listener: NetworkStateListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(msg: NetworkMessage) {
    this.listeners.forEach((listener) => {
      try {
        listener(msg);
      } catch (err) {
        console.warn('Error in network listener:', err);
      }
    });
  }

  /**
   * Host a new Wi-Fi / Hotspot Room
   */
  public async hostRoom(
    roomCode: string,
    hostPlayer: { id: string; name: string; avatar: AvatarType }
  ): Promise<{ roomCode: string; status: 'ready' }> {
    this.cleanup();
    this.isHost = true;
    this.currentRoomCode = roomCode;
    this.myPlayerId = hostPlayer.id;

    // 1. Set up BroadcastChannel
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.broadcastChannel = new BroadcastChannel(`imposter_wifi_${roomCode}`);
        this.broadcastChannel.onmessage = (event) => {
          const msg = event.data as NetworkMessage;
          if (msg && msg.roomCode === roomCode && msg.senderId !== this.myPlayerId) {
            this.emit(msg);
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel fallback:', e);
    }

    // 2. Set up LocalStorage Sync fallback
    if (typeof window !== 'undefined') {
      this.storageListener = (e: StorageEvent) => {
        if (e.key === `imposter_msg_${roomCode}` && e.newValue) {
          try {
            const msg = JSON.parse(e.newValue) as NetworkMessage;
            if (msg && msg.roomCode === roomCode && msg.senderId !== this.myPlayerId) {
              this.emit(msg);
            }
          } catch {}
        }
      };
      window.addEventListener('storage', this.storageListener);
    }

    // 3. Set up PeerJS with deterministic Room ID so clients can connect directly
    try {
      const hostPeerId = `imposter-room-${roomCode}`;
      this.peer = new Peer(hostPeerId, {
        debug: 0,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        }
      });

      this.peer.on('error', (err) => {
        console.warn('PeerJS host info:', err?.type || err);
      });

      this.peer.on('connection', (conn) => {
        conn.on('open', () => {
          this.connections.set(conn.peer, conn);
        });

        conn.on('data', (data: any) => {
          const msg = data as NetworkMessage;
          if (msg && msg.roomCode === this.currentRoomCode) {
            this.emit(msg);
            // Forward to other connected clients
            this.connections.forEach((otherConn, otherPeerId) => {
              if (otherPeerId !== conn.peer && otherConn.open) {
                try {
                  otherConn.send(msg);
                } catch {}
              }
            });
          }
        });

        conn.on('close', () => {
          this.connections.delete(conn.peer);
        });

        conn.on('error', () => {
          this.connections.delete(conn.peer);
        });
      });
    } catch (err) {
      console.warn('PeerJS host init note:', err);
    }

    return { roomCode, status: 'ready' };
  }

  /**
   * Join an existing Wi-Fi / Hotspot Room as a Client
   */
  public async joinRoom(
    roomCode: string,
    player: { id: string; name: string; avatar: AvatarType }
  ): Promise<boolean> {
    this.cleanup();
    this.isHost = false;
    this.currentRoomCode = roomCode;
    this.myPlayerId = player.id;

    // 1. Set up BroadcastChannel
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.broadcastChannel = new BroadcastChannel(`imposter_wifi_${roomCode}`);
        this.broadcastChannel.onmessage = (event) => {
          const msg = event.data as NetworkMessage;
          if (msg && msg.roomCode === roomCode && msg.senderId !== this.myPlayerId) {
            this.emit(msg);
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel error:', e);
    }

    // 2. Set up Storage fallback
    if (typeof window !== 'undefined') {
      this.storageListener = (e: StorageEvent) => {
        if (e.key === `imposter_msg_${roomCode}` && e.newValue) {
          try {
            const msg = JSON.parse(e.newValue) as NetworkMessage;
            if (msg && msg.roomCode === roomCode && msg.senderId !== this.myPlayerId) {
              this.emit(msg);
            }
          } catch {}
        }
      };
      window.addEventListener('storage', this.storageListener);
    }

    // 3. Send initial join broadcast via local channels immediately
    const joinMsg: NetworkMessage = {
      type: 'JOIN_REQUEST',
      senderId: player.id,
      senderName: player.name,
      senderAvatar: player.avatar,
      roomCode: roomCode,
      payload: { player },
      timestamp: Date.now()
    };
    this.sendMessage(joinMsg);

    // 4. Set up PeerJS Client to connect to host's deterministic ID
    try {
      const clientPeerId = `imposter-client-${player.id}-${Math.floor(Math.random() * 10000)}`;
      this.peer = new Peer(clientPeerId, {
        debug: 0,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        }
      });

      this.peer.on('error', (err) => {
        console.warn('PeerJS client info:', err?.type || err);
      });

      this.peer.on('open', () => {
        try {
          const hostPeerId = `imposter-room-${roomCode}`;
          const conn = this.peer!.connect(hostPeerId, { reliable: true });
          this.hostConnection = conn;

          conn.on('open', () => {
            conn.send(joinMsg);
          });

          conn.on('data', (data: any) => {
            const msg = data as NetworkMessage;
            if (msg && msg.roomCode === this.currentRoomCode) {
              this.emit(msg);
            }
          });

          conn.on('close', () => {
            this.hostConnection = null;
          });
        } catch (connErr) {
          console.warn('Peer connect error:', connErr);
        }
      });
    } catch (err) {
      console.warn('PeerJS client init note:', err);
    }

    // Broadcast again after short delay to ensure host is ready
    setTimeout(() => {
      this.sendMessage(joinMsg);
    }, 400);

    return true;
  }

  /**
   * Send a message to all connected peers
   */
  public sendMessage(msg: NetworkMessage) {
    msg.timestamp = Date.now();
    msg.roomCode = this.currentRoomCode;

    // 1. BroadcastChannel
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(msg);
      } catch (e) {
        console.warn('Error broadcasting message:', e);
      }
    }

    // 2. Storage event
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(`imposter_msg_${this.currentRoomCode}`, JSON.stringify(msg));
      } catch {}
    }

    // 3. PeerJS DataConnections
    if (this.isHost) {
      this.connections.forEach((conn) => {
        if (conn.open) {
          try {
            conn.send(msg);
          } catch (e) {
            console.warn('Error sending to client peer:', e);
          }
        }
      });
    } else if (this.hostConnection && this.hostConnection.open) {
      try {
        this.hostConnection.send(msg);
      } catch (e) {
        console.warn('Error sending to host peer:', e);
      }
    }
  }

  public cleanup() {
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.close();
      } catch {}
      this.broadcastChannel = null;
    }

    if (this.storageListener && typeof window !== 'undefined') {
      try {
        window.removeEventListener('storage', this.storageListener);
      } catch {}
      this.storageListener = null;
    }

    if (this.hostConnection) {
      try {
        this.hostConnection.close();
      } catch {}
      this.hostConnection = null;
    }

    this.connections.forEach((conn) => {
      try {
        conn.close();
      } catch {}
    });
    this.connections.clear();

    if (this.peer) {
      try {
        this.peer.destroy();
      } catch {}
      this.peer = null;
    }

    this.listeners.clear();
  }
}

export const networkHub = new LocalNetworkHub();
