import { Player } from '../models/player/Player';
import { Room } from '../models/room/Room';
import { SocketListener } from '../router/types';
import { ServerSocketProvider } from '../services/socket/ServerSocketProvider';

export const disconnectListener: SocketListener = async function (socket) {
  console.log('User disconnected.', socket.playerId);

  if (!socket.playerId) {
    return;
  }

  try {
    if (socket.roomId) {
      const remainingPlayer = await Player.findOne({
        _id: { $ne: socket.playerId },
        room: socket.roomId,
      }).exec();

      if (remainingPlayer) {
        await remainingPlayer.setNewGame();

        const response = {
          message: "Your enemy couldn't stand it, he/she disconnected.",
          board: remainingPlayer.boardDefault,
          playerLeft: true,
        };

        const { io } = ServerSocketProvider.getInstance();
        io.to(remainingPlayer.socketId).emit('enemy-disconnected', response);
      }

      const room = await Room.findById(socket.roomId).exec();
      await room?.removePlayerFromRoom(socket.playerId);
    }

    await Player.deleteOne({ _id: socket.playerId }).exec();
  } catch (err) {
    console.error('An error occurred during disconnect.', err);
  }
};
