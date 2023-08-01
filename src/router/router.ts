import socketio from 'socket.io';

import { userConnectListener } from 'listeners/connect';
import { userDisconnectListener } from 'listeners/disconnect';
import { matchmakingListener } from 'listeners/matchmaking';
import { ExtendedSocket, listenerWrapper } from './utils';

export function socketRouter(socket: ExtendedSocket, io: socketio.Server) {
  listenerWrapper(userConnectListener, socket, io)({});

  socket.on('matchmaking', listenerWrapper(matchmakingListener, socket, io));

  socket.on('disconnect', listenerWrapper(userDisconnectListener, socket, io));
}
