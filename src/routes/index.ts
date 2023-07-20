import { Socket } from 'socket.io';

import { onConnect } from '../controllers/connect';
import { handleGame } from '../controllers/game';
import { matchmaking } from '../controllers/matchmaking';
import { privateMatchmaking } from '../controllers/privateMatchmaking';
import { createPrivateRoom } from '../controllers/privateRoom';
import { applySetting } from '../controllers/setting';
import { getTurnId } from '../controllers/turn';

export interface ExtSocket extends Socket {
  playerId?: string;
  roomId?: string;
  turnId?: number;
}

export default function (socket: ExtSocket) {
  //1
  socket.on('connect-player', onConnect);
  //1 PRIV
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
