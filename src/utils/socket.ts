type IO = null | SocketIO.Server;
let io: IO;

export function init(ioServer: IO) {
  io = ioServer;
}

export function getIO(): IO {
  return io;
}
