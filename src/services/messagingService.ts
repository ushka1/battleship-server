import { ExtendedSocket } from 'router/utils';

type Message = {
  content: string;
  [key: string]: unknown;
};

export function emitErrorMessage(socket: ExtendedSocket, error: Message) {
  socket.emit('message-channel', { ...error, severity: 'error' });
}

export function emitInfoMessage(socket: ExtendedSocket, info: Message) {
  socket.emit('message-channel', { ...info, severity: 'info' });
}
