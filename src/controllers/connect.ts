import Player from '../models/Player';
import Room from '../models/Room';
import { ExtSocket } from './index';

export const onConnect = async function (this: ExtSocket, name: string) {
  if (this.playerId) {
    return;
  }

  try {
    const player = await Player.create({ name });

    const response = {
      message: `Congratulations ${name}, you successfully connected to our game!`,
      player: player.toObject({ getters: true }),
    };

    this.emit('connect-player', response);

    this.playerId = player.id;
    this.on('disconnect', onDisconnect.bind(this));
  } catch (err) {
    this.error({ message: 'User passed invalid input' });
  }
};

const onDisconnect = async function (this: ExtSocket) {
  if (this.playerId) {
    const player = await Player.findById(this.playerId);

    if (player?.room) {
      const room = await Room.findById(player.room);
      await room?.removeFromRoom(player.id);
    }

    await player?.remove();
  }
};
