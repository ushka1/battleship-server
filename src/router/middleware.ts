/* eslint-disable @typescript-eslint/no-explicit-any */

import { Mutex } from 'async-mutex';
import { logger } from 'config/logger';
import { emitErrorNotification } from 'services/notificationService';
import socketio from 'socket.io';

export interface ExtendedSocket extends socketio.Socket {
  userId?: string;
}

export type SocketController<T = any> = (props: {
  payload?: T;
  socket: ExtendedSocket;
  io: socketio.Server;
}) => Promise<void>;

/**
 * Wraps a SocketController function to:
 * - provide the access to socket and io objects,
 * - handle any unexpected errors that may occur in the controller,
 * - force sequential execution of controllers to avoid race conditions.
 */
export function controllerMiddleware(
  controller: SocketController,
  socket: ExtendedSocket,
  io: socketio.Server,
  mutex: Mutex,
) {
  return async (payload?: any) => {
    const release = await mutex.acquire();

    try {
      await controller({ payload, socket, io });
    } catch (err) {
      emitErrorNotification(socket, {
        content: 'An unexpected error occurred, please refresh your page.',
      });
      logger.error('Unexpected error in socket controller.', {
        error: err,
        socket,
      });

      socket.disconnect();
    } finally {
      release();
    }
  };
}
