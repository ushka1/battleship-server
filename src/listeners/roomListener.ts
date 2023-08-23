import { logger } from 'config/logger';
import { User } from 'models/User';
import { SocketListener } from 'router/utils';
import { emitErrorMessage } from 'services/messagingService';
import { addUserToRoom, removeUserFromRoom } from 'services/roomService';
import { validateShips } from 'services/shipValidationService';
import { Ship } from 'types';

export type RoomJoinPayload = {
  ships: Ship[];
};
export type RoomJoinResponse = {
  gameReady: boolean;
};

export const roomJoinListener: SocketListener<RoomJoinPayload> =
  async function ({ payload, socket, io }) {
    logger.info(`Room join started.`, { socket });

    const user = await User.findById(socket.userId).orFail().exec();

    if (user.inRoom) {
      logger.error(`User already in a room.`, { socket });
      emitErrorMessage(socket, { content: 'User already in a room.' });
      return;
    }

    const shipsValid = validateShips(payload.ships);
    if (!shipsValid) {
      logger.error(`Invalid ships setup provided.`, { socket });
      emitErrorMessage(socket, { content: 'Invalid ships setup provided.' });
      return;
    }

    const room = await addUserToRoom(user, socket);
    await socket.join(room.id);

    if (room.users.length === 2) {
      const response: RoomJoinResponse = {
        gameReady: true,
      };
      io.in(room.id.toString()).emit('room-update', response);
    } else {
      const response: RoomJoinResponse = {
        gameReady: false,
      };
      socket.emit('room-update', response);
    }
  };

export const roomLeaveListener: SocketListener = async function ({
  socket,
  io,
}) {
  logger.info(`Room leave started.`, { socket });

  const user = await User.findById(socket.userId).orFail().exec();
  if (!user.inRoom) {
    logger.error(`User not in a room.`, { socket });
    emitErrorMessage(socket, { content: 'User not in a room.' });
    return;
  }

  await socket.leave(user.roomId!.toString());
  await removeUserFromRoom(user, socket, io);
};

export type RoomChatPayload = {
  message: string;
};
export type RoomChatResponse = {
  author: string;
  message: string;
};

export const roomChatListener: SocketListener<RoomChatPayload> =
  async function ({ socket, payload, io }) {
    const user = await User.findById(socket.userId).orFail().exec();
    if (!user.roomId) {
      emitErrorMessage(socket, { content: 'User not in a room.' });
      return;
    }

    const response: RoomChatResponse = {
      message: payload.message,
      author: user.username,
    };

    io.in(user.roomId.toString()).emit('room-chat', response);
  };
