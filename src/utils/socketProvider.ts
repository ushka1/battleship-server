import socketio from 'socket.io';

export class SocketProvider {
  private static instance: SocketProvider;

  public static getInstance(): SocketProvider {
    if (!this.instance) {
      throw new Error('SocketService not initialized.');
    }

    return SocketProvider.instance;
  }

  public static initialize(io: socketio.Server) {
    if (this.instance) {
      throw new Error('SocketService already initialized.');
    }

    this.instance = new SocketProvider(io);
  }

  private _io: socketio.Server;

  private constructor(io: socketio.Server) {
    this._io = io;
  }

  public get io(): socketio.Server {
    return this._io;
  }
}
