import { logger } from 'config/logger';
import { UserModel } from 'models/User';
import { SocketController } from 'router/middleware';
import {
  connectUser,
  createNewUser,
  disconnectUser,
  disconnectUserCleanup,
  disconnectUserFromAnotherSession,
  findUserFromHandshake,
} from 'services/connectService';
import { UserUpdatePayload } from 'types/payloads/user';

export const connectController: SocketController = async function ({
  socket,
  io,
}) {
  logger.info('New socket connection.', { socket });

  let user = await findUserFromHandshake(socket);
  if (!user) {
    user = await createNewUser(socket);
  } else {
    if (user.isOnline) {
      await disconnectUserFromAnotherSession(user, socket, io);
    }
    await connectUser(user, socket);
  }

  const response: UserUpdatePayload = {
    userId: user.id,
    username: user.username,
  };

  socket.userId = user.id;
  socket.emit('user-update', response);
};

export const disconnectController: SocketController = async function ({
  socket,
  io,
}) {
  logger.info('Socket disconnection.', { socket });

  const user = await UserModel.findById(socket.userId).orFail().exec();

  await disconnectUserCleanup(user, io);
  await disconnectUser(user, socket);
};
