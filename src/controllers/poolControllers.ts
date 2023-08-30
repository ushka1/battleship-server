import { logger } from 'config/logger';
import { User } from 'models/User';
import { SocketController } from 'router/middleware';
import { emitErrorNotification } from 'services/notificationService';
import {
  addUserToPool,
  addUserToPoolValidator,
  removeUserFromPool,
  removeUserFromPoolValidator,
} from 'services/poolService';

export const joinPoolController: SocketController = async function ({
  socket,
}) {
  const user = await User.findById(socket.userId).orFail().exec();
  const error = addUserToPoolValidator(user);

  if (error) {
    logger.error(error, { socket });
    emitErrorNotification(socket, { content: error });
    return;
  }

  try {
    await addUserToPool(user);
  } catch (e) {
    logger.error('Add user to pool error.', { socket, error: e });
    emitErrorNotification(socket, { content: 'An unexpected error occured.' });
  }
};

export const leavePoolController: SocketController = async function ({
  socket,
}) {
  const user = await User.findById(socket.userId).orFail().exec();
  const error = removeUserFromPoolValidator(user);

  if (error) {
    logger.error(error, { socket });
    emitErrorNotification(socket, { content: error });
    return;
  }

  try {
    await removeUserFromPool(user);
  } catch (e) {
    logger.error('Remove user from pool error.', { socket, error: e });
    emitErrorNotification(socket, { content: 'An unexpected error occured.' });
  }
};
