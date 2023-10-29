import { ExtendedSocket } from 'router/middleware';

export function emitPoolJoin(socket: ExtendedSocket) {
  socket.emit('pool/join');
}

export function emitPoolLeave(socket: ExtendedSocket) {
  socket.emit('pool/leave');
}
