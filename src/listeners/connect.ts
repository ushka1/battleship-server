import { logger } from 'config/logger';
import { SocketListener } from 'router/utils';
import {
  connectUser,
  createNewUser,
  disconnectUser,
  findUser,
} from 'services/connect';

export type UserDataResponse = {
  userId: string;
  username: string;
};

export const connectHandler: SocketListener = async function ({ socket, io }) {
  logger.info('New socket connection.', { socket });

  let user = await findUser(socket);
  if (user) {
    await connectUser(user, socket, io);
  } else {
    user = await createNewUser(socket);
  }

  const response: UserDataResponse = {
    userId: user.id,
    username: user.username,
  };

  socket.userId = user.id;
  socket.emit('user-data', response);
};

export const disconnectListener: SocketListener = async function ({
  socket,
  io,
}) {
  logger.info('Socket disconnection.', { socket });

  const user = await findUser(socket);
  if (!user) {
    logger.error('User not found while disconnecting.', { socket });
    return;
  }

  await disconnectUser(user, socket, io);
};
