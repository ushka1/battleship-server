import Player from '../models/Player';
import Room from '../models/Room';
import { changeTurn } from './turn';
import { ExtSocket } from './index';
import { getIO } from '../utils/socket';

export const handleGame = async function (
  this: ExtSocket,
  coords: { row: number; col: number },
) {
  const io = getIO();
  const room = await Room.findById(this.roomId);

  try {
    if (!room) {
      throw new Error('An unexpected error occurred.');
    }

    if (room.turn !== this.turnId) {
      return;
    }

    const enemyId = room.players.find((id) => id.toString() !== this.playerId);
    const enemy = await Player.findById(enemyId);

    if (!enemy) {
      throw new Error('An unexpected error occurred.');
    }

    //**************************************************
    //TODO: Handle player attack
    //**************************************************

    const playerSocket = this;
    const enemySocket = io?.sockets.connected[enemy.socketId];

    const shipHitted = await enemy.handleHit(coords.row, coords.col);

    playerSocket.emit('game-controller', { enemyBoard: enemy.board });
    enemySocket!.emit('game-controller', { playerBoard: enemy.board });

    if (shipHitted) {
      playerSocket!.emit('game-controller', { unlock: true });
    } else {
      await changeTurn(this.roomId!);
      enemySocket!.emit('game-controller', { unlock: true });
    }
  } catch (err) {
    console.error('Error in "controllers/game.ts [handleGame]".');

    await room?.populate('players').execPopulate();
    room?.players.forEach((player) => {
      const playerSocket = io?.sockets.connected[player.socketId];
      playerSocket?.error({ message: 'An unexpected error occurred.' });
    });
  }
};
