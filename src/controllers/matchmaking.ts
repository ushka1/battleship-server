import { ExtSocket } from '../routes/index';
import { reconnectionCleanup } from '../utils/reconnectionCleanup';
import { MatchmakingResponse } from '../utils/responses';
import { setTurnIds } from './turn';

import Player from '../models/Player';
import Room from '../models/Room';
import { getErrorMessage } from '../utils/errors';

export const matchmaking = async function (this: ExtSocket) {
  try {
    await reconnectionCleanup(this);

    const player = await Player.findById(this.playerId).exec();
    if (!player) {
      throw new Error('User connection fault.');
    }

    let readyToPlay = true;
    await player.setNewGame();

    let room = await Room.findOne({
      players: { $size: 1 },
      private: { $exists: false },
      disabled: { $exists: false },
    }).exec();

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

      await setTurnIds(this.roomId);
      this.to(this.roomId).emit('matchmaking', response);
    }
  } catch (err) {
    console.error('Error in "controllers/matchmaking.ts [matchmaking]".');
    this._error({ message: getErrorMessage(err) || 'Matchmaking Error' });
  }
};
