import { Room } from '../models/room/Room';
import { ExtendedSocket } from '../services/socket/router';

export const reconnectionCleanup = async (socket: ExtendedSocket) => {
  if (socket.roomId) {
    const room = await Room.findById(socket.roomId).exec();
    if (room) {
      room.locked = false;
      await room?.save();
    }
  }
};
