import { onConnect } from './connect';
import { joinRoom } from './join';
import { applySetting, Board } from './setting';

export interface ExtSocket extends SocketIO.Socket {
  playerId?: string;
  roomId?: string;
  board?: Board;
}

export default function (socket: ExtSocket) {
  socket.on('connect-player', onConnect);
  socket.on('apply-setting', applySetting);
  socket.on('join-room', joinRoom);
}
