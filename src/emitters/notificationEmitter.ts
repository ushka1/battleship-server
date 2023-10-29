import { ExtendedSocket } from 'router/middleware';

type NotificationPayload = {
  content: string;
  severity?: 'info' | 'error' | 'warning' | 'success';

  [key: string]: unknown;
};

export function emitErrorNotification(
  socket: ExtendedSocket,
  payload: NotificationPayload,
) {
  emitNotification(socket, { ...payload, severity: 'error' });
}

export function emitInfoNotification(
  socket: ExtendedSocket,
  payload: NotificationPayload,
) {
  emitNotification(socket, { ...payload, severity: 'info' });
}

export function emitNotification(
  socket: ExtendedSocket,
  payload: NotificationPayload,
) {
  socket.emit('notification', payload);
}
