import { Server } from 'socket.io';

export class SocketManager {
  private static instance: SocketManager;

  private constructor(io: Server) {
    this.io = io;
  }

  io: Server;

  static init(io: Server): SocketManager {
    this.instance = new this(io);
    return this.instance;
  }

  static getInstance(): SocketManager {
    if (this.instance) {
      return this.instance;
    }

    throw new Error('Socket instance not initialized.');
  }
}
