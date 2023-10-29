import { logger } from 'config/logger';
import { emitErrorNotification } from 'emitters/notificationEmitter';
import { emitRoomLeave } from 'emitters/roomEmitter';
import { UserModel } from 'models/User';
import { SocketController } from 'router/middleware';
import {
  removeUserFromRoom,
  removeUserFromRoomValidator,
} from 'services/roomService';

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
  emitRoomLeave(socket);
};
