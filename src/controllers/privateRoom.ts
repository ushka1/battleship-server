import { Player } from '../models/player/Player';
import { Room } from '../models/room/Room';
import { ExtendedSocket } from '../services/socket/router';
import { reconnectionCleanup } from '../utils/reconnectionCleanup';

export const createPrivateRoom = async function (this: ExtendedSocket) {
  try {
    await reconnectionCleanup(this);

    const player = await Player.findById(this.playerId).exec();
    if (!player) {
      throw new Error('Player not found.');
    }

    const privateRoom = await Room.create({
      players: [],
      private: true,
      locked: true,
    });
    privateRoom.addPlayerToRoom(player);

    this.join(privateRoom.id);
    this.roomId = privateRoom.id;

    const response = {
      message: `Congratulations ${player.name}, you successfully joined to the private room!`,
      roomId: privateRoom.id,
    };

    this.emit('private', response);
  } catch (err) {
    console.log('Error in "privateRoom.ts [createPrivateRoom]"');
  }
};
