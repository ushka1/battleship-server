import { ExtSocket } from '../routes';
import Room from '../models/Room';

export const reconnectionCleanup = async (socket: ExtSocket) => {
  if (socket.roomId) {
    const room = await Room.findById(socket.roomId);
    await room?.removeFromRoom(socket.playerId);

    socket.leave(socket.roomId);
    socket.roomId = undefined;
  }
};
