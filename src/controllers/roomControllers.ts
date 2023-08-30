import { logger } from 'config/logger';
import { User } from 'models/User';
import { SocketController } from 'router/middleware';
import { emitErrorNotification } from 'services/notificationService';
import {
  removeUserFromPool,
  removeUserFromPoolValidator,
} from 'services/poolService';

export const leaveRoomController: SocketController = async function ({
  socket,
}) {
  const user = await User.findById(socket.userId).orFail().exec();
  const error = removeUserFromPoolValidator(user);

  if (error) {
    emitErrorNotification(socket, { content: error });
    logger.error(error, { socket });
    return;
  }

  await removeUserFromPool(user);
};
