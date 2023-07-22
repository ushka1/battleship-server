/* eslint-disable @typescript-eslint/no-explicit-any */

import socketio from 'socket.io';

export interface ExtendedSocket extends socketio.Socket {
  playerId?: string;
  roomId?: string;
  turnId?: number;
}

export type SocketListener<T = any> = (
  socket: ExtendedSocket,
  payload: T,
) => Promise<void>;
