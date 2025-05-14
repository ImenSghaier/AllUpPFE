import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.isConnected) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('Disconnected from WebSocket server');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  onStatsUpdate(callback) {
    if (this.socket) {
      this.socket.on('statsUpdate', callback);
    }
  }

  joinUserRoom(userId) {
    if (this.socket) {
      this.socket.emit('join', userId);
    }
  }
}

export const socketService = new SocketService();