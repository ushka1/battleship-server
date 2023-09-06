import { logger } from 'config/logger';
import { UserModel } from 'models/User';
import { SocketController } from 'router/middleware';
import { emitErrorNotification } from 'services/notificationService';
import {
  removeUserFromRoom,
  removeUserFromRoomValidator,
} from 'services/roomService';
import { UserStatus, UserUpdatePayload } from 'types/payloads/user';

export const leaveRoomController: SocketController = async function ({
  socket,
}) {
  const user = await UserModel.findById(socket.userId).orFail().exec();
  const error = removeUserFromRoomValidator(user);

  if (error) {
    emitErrorNotification(socket, { content: error });
    logger.error(error, { socket });
    return;
  }

  await removeUserFromRoom(user);

  const payload: UserUpdatePayload = {
    userStatus: UserStatus.IDLE,
  };
  socket.emit('user-update', payload);
};
