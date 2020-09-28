import Player from '../models/Player';
import Room from '../models/Room';
import { ConnectResponse, MatchmakingResponse } from '../utils/responses';
import { ExtSocket } from './index';
import { getIO } from '../utils/socket';

export const onConnect = async function (this: ExtSocket, name: string) {
  if (this.playerId) {
    return;
  }

  try {
    const player = await Player.create({ name, socketId: this.id });
    const transformedPlayer = { id: player.id, name: player.name };

    const response: ConnectResponse = {
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
        const remainingPlayer = await Player.findOne({
          _id: { $ne: this.playerId },
          room: this.roomId,
        });

        if (remainingPlayer) {
          await remainingPlayer.setNewGame();

          const response: MatchmakingResponse = {
            message: 'Player left your room.',
            playerLeft: true,
            board: remainingPlayer.boardDefault,
          };

          const io = getIO();
          io?.to(remainingPlayer.socketId).emit('matchmaking', response);
        }

        const room = await Room.findById(this.roomId);
        await room?.removeFromRoom(this.playerId);
      }

      await Player.deleteOne({ _id: this.playerId });
    }
  } catch (err) {
    console.error('Error in "controllers/connect.ts [onDisconnect]".');
  }
};
