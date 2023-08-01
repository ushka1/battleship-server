import { ExtendedSocket } from 'router/utils';

type Message = {
  message: string;
  [key: string]: unknown;
};

export function sendErrorMessage(socket: ExtendedSocket, error: Message) {
  socket.emit('error-channel', error);
}

export function sendNotificationMessage(
  socket: ExtendedSocket,
  notification: Message,
) {
  socket.emit('notification-channel', notification);
}
