import { logger } from 'config/logger';
import { Room } from 'models/room/Room';
import { IUser, User } from 'models/user/User';
import { SocketListener } from 'router/utils';

export type userConnectResponse = {
  userId: string;
  username: string;
};

export const userConnectListener: SocketListener = async function ({ socket }) {
  logger.info('User connected.', { socket });
  let user: IUser | null = null;

  // check for existing user
  const userId = socket.handshake.query.userId as string;
  if (userId) {
    try {
      user = await User.findById(userId).exec();
    } catch (err) {
      logger.error('Invalid userId query param provided.', {
        err,
        socket,
      });
    }
  }

  // create new user if none found
  if (!user) {
    logger.info('Creating new user.', { socket });
    user = await User.create({
      socketId: socket.id,
    });
  }

  const response: userConnectResponse = {
    userId: user.id,
    username: user.username,
  };

  socket.userId = user.id;
  socket.emit('user-data', response);
};

export const userDisconnectListener: SocketListener = async function ({
  socket,
}) {
  logger.info('User disconnected.', { socket });

  const user = await User.findById(socket.userId).exec();
  if (!user) {
    logger.error('User not found on disconnect.', { socket });
    return;
  }

  // handle case if user was in a room
  if (user.roomId) {
    try {
      socket.leave(user.roomId.toString());

      const room = await Room.findById(user.roomId).exec();
      if (room) {
        await room.removeUser(user.id);
      }

      if (room?.users.length === 0) {
        await room.deleteOne();
      }

      user.roomId = undefined;
    } catch (err) {
      logger.error('Remove user from room error.', { err, socket });
    }
  }

  user.socketId = undefined; // mark user as offline
  await user.save();
};
