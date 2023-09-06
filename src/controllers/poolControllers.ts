import { logger } from 'config/logger';
import { UserModel } from 'models/User';
import { SocketController } from 'router/middleware';
import { emitErrorNotification } from 'services/notificationService';
import {
  addUserToPool,
  addUserToPoolValidator,
  removeUserFromPool,
  removeUserFromPoolValidator,
} from 'services/poolService';
import { validateShips } from 'services/shipValidationService';
import { JoinPoolBody } from 'types/pool';
import { UserStatus, UserUpdatePayload } from 'types/user';

export const joinPoolController: SocketController<JoinPoolBody> =
  async function ({ socket, body }) {
    const user = await UserModel.findById(socket.userId).orFail().exec();
    const error = addUserToPoolValidator(user);

    if (error) {
      logger.error(error, { socket });
      emitErrorNotification(socket, { content: error });
      return;
    }

    const shipsValid = validateShips(body!.ships);
    if (!shipsValid) {
      logger.error('Invalid ships', { socket });
      emitErrorNotification(socket, {
        content: 'Invalid ships configuration.',
      });
      return;
    }

    user.currentSetting = body!.ships;
    await user.save();

    try {
      await addUserToPool(user);

      const payload: UserUpdatePayload = {
        userStatus: UserStatus.POOL,
      };
      socket.emit('user-update', payload);
    } catch (e) {
      logger.error('Add user to pool error.', { socket, error: e });
      emitErrorNotification(socket, {
        content: 'An unexpected error occured.',
      });
    }
  };

export const leavePoolController: SocketController = async function ({
  socket,
}) {
  const user = await UserModel.findById(socket.userId).orFail().exec();
  const error = removeUserFromPoolValidator(user);

  if (error) {
    logger.error(error, { socket });
    emitErrorNotification(socket, { content: error });
    return;
  }

  try {
    await removeUserFromPool(user);

    const payload: UserUpdatePayload = {
      userStatus: UserStatus.IDLE,
    };
    socket.emit('user-update', payload);
  } catch (e) {
    logger.error('Remove user from pool error.', { socket, error: e });
    emitErrorNotification(socket, { content: 'An unexpected error occured.' });
  }
};
