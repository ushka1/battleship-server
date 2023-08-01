import { logger } from 'config/logger';
import { IUser, User } from 'models/user/User';
import { SocketListener } from 'router/utils';

export type userConnectResponse = {
  user: { id: string; username: string };
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
      logger.error('User not found or invalid query.', { err, socket });
    }
  }

  // create new user if none found
  if (!user) {
    user = await User.create({
      socketId: socket.id,
    });
  }

  const response: userConnectResponse = {
    user: { id: user.id, username: user.username },
  };

  socket.userId = user.id;
  socket.emit('user-connect', response);
};
