import { Mutex } from 'async-mutex';

import {
  connectController,
  disconnectController,
} from 'controllers/connectControllers';
import { gameHitController } from 'controllers/gameController';
import {
  joinPoolController,
  leavePoolController,
} from 'controllers/poolControllers';
import {
  revengeReadyController,
  revengeWillController,
} from 'controllers/revengeController';
import { leaveRoomController } from 'controllers/roomControllers';
import {
  ExtendedSocket,
  controllerMiddleware as middleware,
} from 'router/middleware';

export function socketRouter(socket: ExtendedSocket) {
  const mutex = new Mutex();
  const args = [socket, mutex] as const;

  const connect = middleware(connectController, ...args);
  connect(); // called immediately on connection

  socket.on('pool-join', middleware(joinPoolController, ...args));
  socket.on('pool-leave', middleware(leavePoolController, ...args));

  socket.on('game-hit', middleware(gameHitController, ...args));

  socket.on('revenge-will', middleware(revengeWillController, ...args));
  socket.on('revenge-ready', middleware(revengeReadyController, ...args));

  socket.on('room-leave', middleware(leaveRoomController, ...args));
  socket.on('disconnect', middleware(disconnectController, ...args));
}
