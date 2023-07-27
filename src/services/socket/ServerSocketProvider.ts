import socketio from 'socket.io';

export class ServerSocketProvider {
  private static instance: ServerSocketProvider;

  private constructor(io: socketio.Server) {
    this.io = io;
  }

  io: socketio.Server;

  static init(io: socketio.Server): ServerSocketProvider {
    this.instance = new this(io);
    return this.instance;
  }

  static getInstance(): ServerSocketProvider {
    if (this.instance) {
      return this.instance;
    }

    throw new Error('Socket instance not initialized.');
  }
}
