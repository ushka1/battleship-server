import Room from '../models/room/Room';
import { ExtendedSocket } from '../socket/router';

export const reconnectionCleanup = async (socket: ExtendedSocket) => {
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
