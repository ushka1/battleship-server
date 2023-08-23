import { Mutex } from 'async-mutex';
import { connectHandler, disconnectListener } from 'listeners/connectListener';
import {
  roomChatListener,
  roomJoinListener,
  roomLeaveListener,
} from 'listeners/roomListener';
import socketio from 'socket.io';
import { ExtendedSocket, listenerWrapper as lw } from './utils';

export function socketRouter(socket: ExtendedSocket, io: socketio.Server) {
  const mutex = new Mutex();
  const args = [socket, io, mutex] as const;

  // called immediately after connection
  const wrappedConnectHandler = lw(connectHandler, ...args);
  wrappedConnectHandler();

  // room listeners
  socket.on('room-join', lw(roomJoinListener, ...args));
  socket.on('room-leave', lw(roomLeaveListener, ...args));
  socket.on('room-chat', lw(roomChatListener, ...args));

  socket.on('disconnect', lw(disconnectListener, ...args));
}
