import { logger } from 'config/logger';
import { IUser, User } from 'models/user/User';
import { SocketListener } from 'router/utils';
import { removeUserFromRoom } from 'services/matchmaking';

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
  io,
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
      await removeUserFromRoom(user, socket, io);
    } catch (err) {
      logger.error('Error removing user from room.', { err, socket });
    }
  }

  user.socketId = undefined; // mark user as offline
  await user.save();
};
