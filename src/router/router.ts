import socketio from 'socket.io';

import { Mutex } from 'async-mutex';
import { userConnectListener } from 'listeners/connect';
import { userDisconnectListener } from 'listeners/disconnect';
import { matchmakingListener } from 'listeners/matchmaking';
import { ExtendedSocket, listenerWrapper } from './utils';

export function socketRouter(socket: ExtendedSocket, io: socketio.Server) {
  const mutex = new Mutex();
  const args = [socket, io, mutex] as const;

  listenerWrapper(userConnectListener, ...args)({});

  socket.on('matchmaking', listenerWrapper(matchmakingListener, ...args));

  socket.on('disconnect', listenerWrapper(userDisconnectListener, ...args));
}
