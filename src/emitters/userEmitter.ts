import { ExtendedSocket } from 'router/middleware';

export type UserDataPayload = {
  userId: string;
  username: string;
};

export function emitUserData(socket: ExtendedSocket, payload: UserDataPayload) {
  socket.emit('user/data', payload);
}
