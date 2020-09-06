import { onConnect } from './connect';
import { matchmaking } from './matchmaking';
import { applySetting } from './setting';

export interface ExtSocket extends SocketIO.Socket {
  playerId?: string;
  roomId?: string;
}

export default function (socket: ExtSocket) {
  socket.on('connect-player', onConnect);
  socket.on('apply-setting', applySetting);
  socket.on('matchmaking', matchmaking);
}
