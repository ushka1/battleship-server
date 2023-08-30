import { logger } from 'config/logger';
import { User } from 'models/User';
import { SocketController } from 'router/middleware';
import { emitErrorNotification } from 'services/notificationService';
import {
  removeUserFromRoom,
  removeUserFromRoomValidator,
} from 'services/roomService';
import { UserStatus, UserUpdatePayload } from 'types/user';

export const leaveRoomController: SocketController = async function ({
  socket,
  io,
}) {
  const user = await User.findById(socket.userId).orFail().exec();
  const error = removeUserFromRoomValidator(user);

  if (error) {
    emitErrorNotification(socket, { content: error });
    logger.error(error, { socket });
    return;
  }

  await removeUserFromRoom(user, io);

  const payload: UserUpdatePayload = {
    userStatus: UserStatus.IDLE,
  };
  socket.emit('user-update', payload);
};
