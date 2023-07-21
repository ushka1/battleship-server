import { ExtendedSocket } from '../services/socket/router';
import { SocketServerProvider } from '../services/socket/SocketServerProvider';

import { Player } from '../models/player/Player';
import { Room } from '../models/room/Room';
import { getErrorMessage } from '../utils/errors';
import { setTurnIds } from './turn';

export const privateMatchmaking = async function (
  this: ExtendedSocket,
  roomId: string,
) {
  try {
    const player = await Player.findById(this.playerId).exec();
    const room = await Room.findById(roomId).exec();

    if (!player || !room) {
      throw new Error('Your link has expired.');
    }

    if (room.players.includes(this.playerId)) {
      room.locked = false;
    } else {
      if (room.players.length >= 2) {
        throw new Error('The room is full.');
      }

      await room.addPlayerToRoom(player);

      this.roomId = room.id;
      this.join(room.id);
    }

    await room.save();
    await player.setNewGame();

    if (room.players.length === 2 && !room.locked) {
      const { io } = SocketServerProvider.getInstance();
      await setTurnIds(room.id);

      io.in(room.id).emit('private-matchmaking', {
        message:
          'Congratulations to both players, room is ready to start a game!',
        readyToPlay: true,
      });
    }
  } catch (err) {
    this._error({ message: getErrorMessage(err) });
    console.log(
      'Error in "controllers/privateMatchmaking.ts [privateMatchmaking]"',
    );
  }
};
