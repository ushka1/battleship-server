import { ExtSocket } from './index';
import Player from '../models/Player';
import Room, { IRoom } from '../models/Room';

export type Response = {
  message?: string;
  readyToPlay?: boolean;
  playerLeft?: boolean;
};

export const matchmaking = async function (this: ExtSocket) {
  if (this.roomId) {
    const room = await Room.findById(this.roomId);
    room?.removeFromRoom(this.playerId);

    this.leave(this.roomId);
    this.roomId = undefined;
  }

  try {
    const player = await Player.findById(this.playerId);
    let readyToPlay = true;

    if (!player) {
      throw new Error('Player not found');
    }

    let room: IRoom | null;
    room = await Room.findOne({
      players: { $size: 1 },
      disabled: { $exists: false },
    });

    if (!room) {
      readyToPlay = false;
      room = await Room.create({ players: [] });
    }

    await room.addToRoom(player);

    const response: Response = {
      message: `Congratulations ${player.name}, you successfully joined to the room!`,
      readyToPlay,
    };

    this.roomId = room.id;
    this.join(room.id);
    this.emit('matchmaking', response);

    if (readyToPlay) {
      const response: Response = {
        message: 'Player joined your room!',
        readyToPlay,
      };

      this.to(this.roomId!).emit('matchmaking', response);
    }
  } catch (err) {
    this.error({ message: err.message });
  }
};
