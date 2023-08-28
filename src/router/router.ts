import { Mutex } from 'async-mutex';
import socketio from 'socket.io';

import {
  connectController,
  disconnectController,
} from 'controllers/connectControllers';
import {
  joinPoolController,
  leavePoolController,
} from 'controllers/poolControllers';
import { ExtendedSocket, controllerWrapper as lw } from './utils';

export function socketRouter(socket: ExtendedSocket, io: socketio.Server) {
  const mutex = new Mutex();
  const args = [socket, io, mutex] as const;

  // called immediately after connection
  const wrappedConnectHandler = lw(connectController, ...args);
  wrappedConnectHandler();

  // pool controllers
  socket.on('pool-join', lw(joinPoolController, ...args));
  socket.on('leave-pool', lw(leavePoolController, ...args));

  socket.on('disconnect', lw(disconnectController, ...args));
}
