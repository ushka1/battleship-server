import { logger } from 'config/logger';
import { Room } from 'models/room/Room';
import { User } from 'models/user/User';
import { SocketListener } from 'router/utils';

export const userDisconnectListener: SocketListener = async function ({
  socket,
}) {
  logger.info(`User disconnected.`, { socket });
  if (!socket.userId) return;

  // handle case if user was in a room
  if (socket.roomId) {
    try {
      socket.leave(socket.roomId);

      const room = await Room.findById(socket.roomId).exec();
      if (room) {
        await room.removeUser(socket.userId);
      }
    } catch (err) {
      logger.error('Remove user from room error.', { err, socket });
    }
  }

  await User.deleteOne({ _id: socket.userId }).exec();
};
