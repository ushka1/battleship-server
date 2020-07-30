import { onConnect } from './connect';
import { joinRoom } from './join';
import { applySetting } from './setting';

export interface ExtSocket extends SocketIO.Socket {
  playerId?: string;
  roomId?: string;
}

export default function (socket: ExtSocket) {
  socket.on('connect-player', onConnect);
  socket.on('join-room', joinRoom);
  socket.on('apply-setting', applySetting);
}
