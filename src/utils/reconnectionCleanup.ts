import Room from '../models/Room';
import { ExtSocket } from '../routes';

export const reconnectionCleanup = async (socket: ExtSocket) => {
  if (socket.roomId) {
    const room = await Room.findById(socket.roomId);
    // await room?.removeFromRoom(socket.playerId);

    // socket.leave(socket.roomId);
    // socket.roomId = undefined;
    if (room) {
      room.disabled = false;
      await room?.save();
    }
  }
};
