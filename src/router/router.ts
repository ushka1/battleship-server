import socketio from 'socket.io';

import { Mutex } from 'async-mutex';
import { userConnectListener } from 'listeners/connect';
import { userDisconnectListener } from 'listeners/disconnect';
import {
  cancelMatchmakingListener,
  startMatchmakingListener,
} from 'listeners/matchmaking';
import { ExtendedSocket, listenerWrapper } from './utils';

export function socketRouter(socket: ExtendedSocket, io: socketio.Server) {
  const mutex = new Mutex();
  const args = [socket, io, mutex] as const;

  // called immediately when user connects to the server
  listenerWrapper(userConnectListener, ...args)({});

  socket.on(
    'start-matchmaking',
    listenerWrapper(startMatchmakingListener, ...args),
  );
  socket.on(
    'cancel-matchmaking',
    listenerWrapper(cancelMatchmakingListener, ...args),
  );

  socket.on('disconnect', listenerWrapper(userDisconnectListener, ...args));
}
