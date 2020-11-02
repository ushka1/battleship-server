import { onConnect } from '../controllers/connect';
import { createPrivateRoom } from '../controllers/privateRoom';
import { applySetting } from '../controllers/setting';
import { matchmaking } from '../controllers/matchmaking';
import { privateMatchmaking } from '../controllers/privateMatchmaking';
import { getTurnId } from '../controllers/turn';
import { handleGame } from '../controllers/game';

export interface ExtSocket extends SocketIO.Socket {
  playerId?: string;
  roomId?: string;
  turnId?: number;
}

export default function (socket: ExtSocket) {
  //1
  socket.on('connect-player', onConnect);

  //1.1 PRIV
  socket.on('private', createPrivateRoom);

  //2
  socket.on('apply-setting', applySetting);

  //3
  socket.on('matchmaking', matchmaking);

  //3 PRIV
  socket.on('private-matchmaking', privateMatchmaking);

  //4
  socket.on('turn-controller', getTurnId);
  socket.on('game-controller', handleGame);
}
