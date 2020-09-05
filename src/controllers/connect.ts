import Player from '../models/Player';
import Room from '../models/Room';
import { ExtSocket } from './index';
import { Response as MatchmakingResponse } from './matchmaking';

export const onConnect = async function (this: ExtSocket, name: string) {
  if (this.playerId) {
    return;
  }

  try {
    const player = await Player.create({ name });
    const transformedPlayer = { id: player.id, name: player.name };

    const response = {
      message: `Congratulations ${name}, you successfully connected to our game!`,
      player: transformedPlayer,
    };

    this.emit('connect-player', response);

    this.playerId = player.id;
    this.on('disconnect', onDisconnect.bind(this));
  } catch (err) {
    console.log(err);
    this.error({ message: 'User passed invalid input' });
  }
};

const onDisconnect = async function (this: ExtSocket) {
  if (this.playerId) {
    const player = await Player.findById(this.playerId);

    if (this.roomId) {
      const response: MatchmakingResponse = {
        message: 'Player left your room.',
        playerLeft: true,
      };

      this.to(this.roomId).emit('matchmaking', response);
    }

    if (player?.room) {
      const room = await Room.findById(player.room);
      if (room) {
        await room.removeFromRoom(player.id);
      }
    }

    await player?.remove();
  }
};
