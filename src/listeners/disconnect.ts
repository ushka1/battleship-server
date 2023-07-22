import { Player } from '../models/player/Player';
import { Room } from '../models/room/Room';
import { SocketServerProvider } from '../services/socket/SocketServerProvider';
import { SocketListener } from '../services/socket/types';
import { DisconnectResponse } from '../types/responses';

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

        const response: DisconnectResponse = {
          message: "Your enemy couldn't stand it, he/she disconnected.",
          board: remainingPlayer.boardDefault,
          playerLeft: true,
        };

        const { io } = SocketServerProvider.getInstance();
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
