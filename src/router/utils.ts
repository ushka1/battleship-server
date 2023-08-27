/* eslint-disable @typescript-eslint/no-explicit-any */

import { Mutex } from 'async-mutex';
import { logger } from 'config/logger';
import { emitErrorNotification } from 'services/notificationService';
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
 * Wraps a SocketListener function to:
 * - provide the access to socket and io objects,
 * - handle any unexpected errors that may occur in the listener,
 * - force sequential execution of listeners to avoid race conditions.
 */
export function listenerWrapper(
  listener: SocketListener,
  socket: ExtendedSocket,
  io: socketio.Server,
  mutex: Mutex,
) {
  return async (payload?: any) => {
    const release = await mutex.acquire();

    try {
      await listener({ payload, socket, io });
    } catch (err) {
      emitErrorNotification(socket, {
        content: 'An unexpected error occurred, please refresh your page.',
      });
      logger.error('Unexpected error in socket listener.', {
        err,
        socket,
      });

      socket.disconnect();
    } finally {
      release();
    }
  };
}
