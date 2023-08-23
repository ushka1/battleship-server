import { logger } from 'config/logger';
import { User } from 'models/User';
import { SocketListener } from 'router/utils';
import {
  connectUser,
  createNewUser,
  disconnectUser,
  findUserFromHandshake,
} from 'services/connectService';

export type UserUpdateResponse = {
  userId: string;
  username: string;
};

export const connectHandler: SocketListener = async function ({ socket, io }) {
  logger.info('New socket connection.', { socket });

  let user = await findUserFromHandshake(socket);
  if (user) {
    await connectUser(user, socket, io);
  } else {
    user = await createNewUser(socket);
  }

  const response: UserUpdateResponse = {
    userId: user.id,
    username: user.username,
  };

  socket.userId = user.id;
  socket.emit('user-update', response);
};

export const disconnectListener: SocketListener = async function ({
  socket,
  io,
}) {
  logger.info('Socket disconnection.', { socket });

  const user = await User.findById(socket.userId).exec();
  if (!user) {
    logger.error('User not found while disconnecting.', { socket });
    return;
  }

  await disconnectUser(user, socket, io);
};
