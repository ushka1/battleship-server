type IO = null | SocketIO.Server;
let io: IO;

export function init(ioServer: IO) {
  if (io) {
    return;
  } else {
    io = ioServer;
  }
}

export function getIO(): IO {
  if (io) {
    return io;
  } else {
    throw new Error('Socket.io error occurred');
  }
}
