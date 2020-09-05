type IO = null | SocketIO.Server;
let io: IO;

export function init(ioServer: IO) {
  io = ioServer;
}

export function getIO(): IO {
  if (io) {
    return io;
  } else {
    throw new Error('Socket.io error occurred');
  }
}
