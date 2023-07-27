import { disconnectListener } from '../listeners/disconnect';
import { handleGame } from '../listeners/game';
import { matchmaking } from '../listeners/matchmaking';
import { privateMatchmaking } from '../listeners/privateMatchmaking';
import { createPrivateRoom } from '../listeners/privateRoom';
import { applySettingListener } from '../listeners/setting';
import { getTurnId } from '../listeners/turn';
import { userJoinListener } from '../listeners/userJoin';
import { listenerWithSocket } from './helpers';
import { ExtendedSocket } from './types';

export function socketRouter(socket: ExtendedSocket) {
  console.log('New user connected.');

  socket.on('user-join', listenerWithSocket(socket, userJoinListener));
  socket.on('apply-setting', listenerWithSocket(socket, applySettingListener));

  socket.on('matchmaking', matchmaking);
  socket.on('private', createPrivateRoom);
  socket.on('private-matchmaking', privateMatchmaking);

  socket.on('turn-controller', getTurnId);
  socket.on('game-controller', handleGame);

  socket.on('disconnect', listenerWithSocket(socket, disconnectListener));
}
