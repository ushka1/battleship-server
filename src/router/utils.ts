/* eslint-disable @typescript-eslint/no-explicit-any */

import socketio from 'socket.io';

export interface ExtendedSocket extends socketio.Socket {
  userId?: string;
}

export type SocketListener<T = any> = (props: {
  payload: T;
  socket: ExtendedSocket;
  io: socketio.Server;
}) => Promise<void>;

/**
 * Wraps a SocketListener function to provide the access to socket and io objects.
 */
export function listenerWrapper(
  listener: SocketListener,
  socket: ExtendedSocket,
  io: socketio.Server,
) {
  return (payload: any) => listener({ payload, socket, io });
}
