import { ExtSocket } from '../routes/index';
import { Socket } from '../utils/Socket';

import { setTurnIds } from './turn';
import Room from '../models/Room';
import Player from '../models/Player';

export const privateMatchmaking = async function (
  this: ExtSocket,
  roomId: string,
) {
  try {
    const player = await Player.findById(this.playerId);
    const room = await Room.findById(roomId);

    if (!player || !room) {
      throw new Error('Your link has expired.');
    }

    if (room.players.includes(this.playerId)) {
      room.disabled = false;
    } else {
      if (room.players.length >= 2) {
        throw new Error('The room is full.');
      }

      await room.addToRoom(player);

      this.roomId = room.id;
      this.join(room.id);
    }

    await room.save();
    await player.setNewGame();

    if (room.players.length === 2 && !room.disabled) {
      const { io } = Socket.getInstance();
      io.in(room.id).emit('private-matchmaking', {
        message:
          'Congratulations to both players, room is ready to start a game!',
        readyToPlay: true,
      });

      setTurnIds(room.id);
    }
  } catch (err) {
    this.error({ message: err.message });
    console.log(
      'Error in "controllers/privateMatchmaking.ts [privateMatchmaking]"',
    );
  }
};
