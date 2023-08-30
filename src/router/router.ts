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
import { leaveRoomController } from 'controllers/roomControllers';
import {
  ExtendedSocket,
  controllerMiddleware as middleware,
} from 'router/middleware';

export function socketRouter(socket: ExtendedSocket, io: socketio.Server) {
  const mutex = new Mutex();
  const args = [socket, io, mutex] as const;

  const connect = middleware(connectController, ...args);
  connect(); // called immediately on connection

  socket.on('pool-join', middleware(joinPoolController, ...args));
  socket.on('leave-pool', middleware(leavePoolController, ...args));

  socket.on('leave-room', middleware(leaveRoomController, ...args));

  socket.on('disconnect', middleware(disconnectController, ...args));
}
