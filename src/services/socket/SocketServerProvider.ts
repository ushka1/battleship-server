import socketio from 'socket.io';

export class SocketServerProvider {
  private static instance: SocketServerProvider;

  private constructor(io: socketio.Server) {
    this.io = io;
  }

  io: socketio.Server;

  static init(io: socketio.Server): SocketServerProvider {
    this.instance = new this(io);
    return this.instance;
  }

  static getInstance(): SocketServerProvider {
    if (this.instance) {
      return this.instance;
    }

    throw new Error('Socket instance not initialized.');
  }
}
