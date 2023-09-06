import socketio from 'socket.io';

export class SocketProvider {
  private static instance: SocketProvider;

  private static getInstance(): SocketProvider {
    if (!this.instance) {
      throw new Error('SocketService not initialized.');
    }

    return SocketProvider.instance;
  }

  public static getIO(): socketio.Server {
    return this.getInstance().io;
  }

  public static getSocket(socketId: string): socketio.Socket | undefined {
    return this.getInstance().io.sockets.sockets.get(socketId);
  }

  public static initialize(io: socketio.Server) {
    if (this.instance) {
      throw new Error('SocketService already initialized.');
    }

    this.instance = new SocketProvider(io);
  }

  private io: socketio.Server;

  private constructor(io: socketio.Server) {
    this.io = io;
  }
}
