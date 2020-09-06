import { ExtSocket } from './index';
import { Response as MatchmakingResponse } from './matchmaking';
import Player from '../models/Player';
import Room from '../models/Room';

type Response = {
  message?: string;
  player?: any;
};

export const onConnect = async function (this: ExtSocket, name: string) {
  if (this.playerId) {
    return;
  }

  try {
    const player = await Player.create({ name, socketId: this.id });
    const transformedPlayer = { id: player.id, name: player.name };

    const response: Response = {
      message: `Congratulations ${name}, you successfully connected to our game!`,
      player: transformedPlayer,
    };

    this.emit('connect-player', response);

    this.playerId = player.id;
    this.on('disconnect', onDisconnect.bind(this));
  } catch (err) {
    console.error('Error in "controllers/connect.ts [onConnect]".');
    this.error({ message: 'User connection fault.' });
  }
};

const onDisconnect = async function (this: ExtSocket) {
  try {
    if (this.playerId) {
      if (this.roomId) {
        //* If player was in room:
        //* - send message to the room that player left,
        //* - mark room as disabled, so no one can access it.

        const response: MatchmakingResponse = {
          message: 'Player left your room.',
          playerLeft: true,
        };

        this.to(this.roomId).emit('matchmaking', response);

        const room = await Room.findById(this.roomId);
        await room?.removeFromRoom(this.playerId);
      }

      await Player.deleteOne({ _id: this.playerId });
    }
  } catch (err) {
    console.error('Error in "controllers/connect.ts [onDisconnect]".');
  }
};
