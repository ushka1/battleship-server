import { logger } from 'config/logger';
import { emitErrorNotification } from 'emitters/notificationEmitter';
import { emitPoolJoin, emitPoolLeave } from 'emitters/poolEmitter';
import { Ship } from 'models/Ship';
import { UserModel } from 'models/User';
import { SocketController } from 'router/middleware';
import {
  addUserToPool,
  addUserToPoolValidator,
  removeUserFromPool,
  removeUserFromPoolValidator,
} from 'services/poolService';
import { validateShipsSetting } from 'services/shipsSettingService';

type JoinPoolPayload = {
  ships: Ship[];
};

export const joinPoolController: SocketController<JoinPoolPayload> =
  async function ({ socket, payload: body }) {
    const user = await UserModel.findById(socket.userId).orFail().exec();
    const error = addUserToPoolValidator(user);

    if (error) {
      logger.error(error, { socket });
      emitErrorNotification(socket, { content: error });
      return;
    }

    const shipsValid = validateShipsSetting(body!.ships);
    if (!shipsValid) {
      logger.error('Invalid ships', { socket });
      emitErrorNotification(socket, {
        content: 'Invalid ships configuration.',
      });
      return;
    }

    user.shipsSetting = body!.ships;
    await user.save();

    try {
      await addUserToPool(user);
      emitPoolJoin(socket);
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
    emitPoolLeave(socket);
  } catch (e) {
    logger.error('Remove user from pool error.', { socket, error: e });
    emitErrorNotification(socket, { content: 'An unexpected error occured.' });
  }
};
