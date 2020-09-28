import Player from '../models/Player';
import Room from '../models/Room';
import { MatchmakingResponse } from '../utils/responses';
import { setTurnIds } from './turn';
import { ExtSocket } from './index';

export const matchmaking = async function (this: ExtSocket) {
  try {
    if (this.roomId) {
      // * PLAYER RECONNECTION CLEANUP * //
      const room = await Room.findById(this.roomId);
      await room?.removeFromRoom(this.playerId);

      this.leave(this.roomId);
      this.roomId = undefined;
    }

    const player = await Player.findById(this.playerId);
    if (!player) {
      throw new Error('User connection fault.');
    }

    let readyToPlay = true;
    await player.setNewGame();

    let room = await Room.findOne({
      players: { $size: 1 },
      disabled: { $exists: false },
    });

    if (!room) {
      readyToPlay = false;
      room = await Room.create({ players: [] });
    }
    await room.addToRoom(player);

    const response: MatchmakingResponse = {
      message: `Congratulations ${player.name}, you successfully joined to the room!`,
      readyToPlay,
    };

    this.roomId = room.id as string;
    this.join(this.roomId);
    this.emit('matchmaking', response);

    if (readyToPlay) {
      const response: MatchmakingResponse = {
        message: `Congratulations, new player joined your room!`,
        readyToPlay,
      };

      this.to(this.roomId).emit('matchmaking', response);
      setTurnIds(this.roomId);
    }
  } catch (err) {
    console.error('Error in "controllers/matchmaking.ts [matchmaking]".');
    this.error({ message: err.message || 'Matchmaking Error' });
  }
};
