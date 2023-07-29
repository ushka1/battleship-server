import socketio from 'socket.io';

import { userConnectHandler } from 'listeners/connect';
import { userDisconnectListener } from 'listeners/disconnect';
import { ExtendedSocket, listenerWrapper } from './utils';

export function socketRouter(socket: ExtendedSocket, io: socketio.Server) {
  userConnectHandler(socket);

  socket.on('disconnect', listenerWrapper(userDisconnectListener, socket, io));
}
