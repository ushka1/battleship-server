/* eslint-disable @typescript-eslint/no-explicit-any */

import { ExtendedSocket, SocketListener } from './types';

export function listenerWithSocket(
  socket: ExtendedSocket,
  listener: SocketListener,
) {
  return (payload: any) => listener(socket, payload);
}
