import { disconnectListener } from '../listeners/disconnect';
import { listenerWithSocket } from './helpers';
import { ExtendedSocket } from './types';

export function socketRouter(socket: ExtendedSocket) {
  console.log('New user connected.');

  socket.on('disconnect', listenerWithSocket(socket, disconnectListener));
}
