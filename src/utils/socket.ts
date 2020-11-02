export class Socket {
  io: SocketIO.Server;

  private constructor(io: SocketIO.Server) {
    this.io = io;
  }

  static init(io: SocketIO.Server) {
    this.instance = new this(io);
  }
  static instance: Socket;
  static getInstance() {
    if (this.instance) {
      return this.instance;
    } else {
      throw new Error('Error in "utils/socket.ts [getIO]".');
    }
  }
}
