import { Mutex } from 'async-mutex';
import { roomChatListener } from 'listeners/chat';
import { connectHandler, disconnectListener } from 'listeners/connect';
import {
  cancelMatchmakingListener,
  startMatchmakingListener,
} from 'listeners/matchmaking';
import socketio from 'socket.io';
import { ExtendedSocket, listenerWrapper as lw } from './utils';

export function socketRouter(socket: ExtendedSocket, io: socketio.Server) {
  const mutex = new Mutex();
  const args = [socket, io, mutex] as const;

  // called immediately after connection
  const wrappedConnectHandler = lw(connectHandler, ...args);
  wrappedConnectHandler();

  // event listeners
  socket.on('start-matchmaking', lw(startMatchmakingListener, ...args));
  socket.on('cancel-matchmaking', lw(cancelMatchmakingListener, ...args));

  socket.on('room-chat', lw(roomChatListener, ...args));

  socket.on('disconnect', lw(disconnectListener, ...args));
}
