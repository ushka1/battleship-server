/* eslint-disable @typescript-eslint/no-explicit-any */

import { logger } from 'config/logger';
import { sendErrorMessage } from 'services/messageChannels';
import socketio from 'socket.io';

export interface ExtendedSocket extends socketio.Socket {
  userId?: string;
  roomId?: string;
}

export type SocketListener<T = any> = (props: {
  payload: T;
  socket: ExtendedSocket;
  io: socketio.Server;
}) => Promise<void>;

/**
 * Wraps a SocketListener function to provide the access to socket and io objects
 * and to handle any unexpected errors that may occur in the listener.
 */
export function listenerWrapper(
  listener: SocketListener,
  socket: ExtendedSocket,
  io: socketio.Server,
) {
  return async (payload: any) => {
    try {
      await listener({ payload, socket, io });
    } catch (err) {
      sendErrorMessage(socket, {
        message: 'An unexpected error occurred, please refresh your page.',
      });
      logger.error('Unexpected error in socket listener.', {
        err,
        socket,
      });

      socket.disconnect();
    }
  };
}
