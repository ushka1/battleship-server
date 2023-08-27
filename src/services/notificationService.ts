import { ExtendedSocket } from 'router/utils';

type Notification = {
  content: string;
  severity?: 'info' | 'error';

  [key: string]: unknown;
};

export function emitErrorNotification(
  socket: ExtendedSocket,
  error: Notification,
) {
  emitNotification(socket, { ...error, severity: 'error' });
}

export function emitInfoNotification(
  socket: ExtendedSocket,
  info: Notification,
) {
  emitNotification(socket, { ...info, severity: 'info' });
}

export function emitNotification(
  socket: ExtendedSocket,
  notification: Notification,
) {
  socket.emit('notification', notification);
}
