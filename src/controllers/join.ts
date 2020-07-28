import { ExtSocket } from './index';
import Player from '../models/Player';
import Room, { IRoom } from '../models/Room';

export const joinRoom = async function (this: ExtSocket) {
  if (this.roomId) {
    return;
  }

  try {
    const player = await Player.findById(this.playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    let room: IRoom | null;
    room = await Room.findOne({ players: { $size: 1 } });
    if (!room) {
      room = await Room.create({ players: [] });
    }

    await room.addToRoom(player);

    const response = {
      message: `Congratulations ${player.name}, you successfully joined to the room!`,
      player: player.toObject({ getters: true }),
    };

    this.roomId = room.id;
    this.join(room.id);
    this.emit('join-room', response);
  } catch (err) {
    this.error(err);
  }
};
