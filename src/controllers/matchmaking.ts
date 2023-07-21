import { ExtendedSocket } from '../services/socket/router';
import { MatchmakingResponse } from '../types/responses';
import { reconnectionCleanup } from '../utils/reconnectionCleanup';
import { setTurnIds } from './turn';

import { Player } from '../models/player/Player';
import { Room } from '../models/room/Room';
import { getErrorMessage } from '../utils/errors';

export const matchmaking = async function (this: ExtendedSocket) {
  try {
    await reconnectionCleanup(this);

    const player = await Player.findById(this.playerId).exec();
    if (!player) {
      throw new Error('User connection fault.');
    }

    await player.setNewGame();
    let readyToPlay = false;

    let room = await Room.findOne({
      players: { $size: 1 },
      private: { $exists: false },
      locked: { $exists: false },
    }).exec();

    if (room) {
      readyToPlay = true;
    } else {
      room = await Room.create({ players: [] });
    }

    await room.addPlayerToRoom(player);
    this.roomId = room.id as string;
    this.join(this.roomId);

    if (readyToPlay) {
      await setTurnIds(this.roomId);

      const response: MatchmakingResponse = {
        message: `Congratulations, new player joined your room!`,
        readyToPlay,
      };
      this.to(this.roomId).emit('matchmaking', response);
    }

    const response: MatchmakingResponse = {
      message: `Congratulations ${player.name}, you successfully joined to the room!`,
      readyToPlay,
    };
    this.emit('matchmaking', response);
  } catch (err) {
    console.error('Error in "controllers/matchmaking.ts [matchmaking]".');
    this._error({ message: getErrorMessage(err) || 'Matchmaking Error' });
  }
};
