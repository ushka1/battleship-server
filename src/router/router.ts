import { userConnectListener } from 'listeners/connect';
import { disconnectListener } from 'listeners/disconnect';
import { listenerWithSocket } from './helpers';
import { ExtendedSocket } from './types';

export function socketRouter(socket: ExtendedSocket) {
  userConnectListener(socket);

  socket.on('disconnect', listenerWithSocket(socket, disconnectListener));
}
