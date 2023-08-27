import { logger } from 'config/logger';
import { IPopulatedRoom } from 'models/Room';
import { User } from 'models/User';
import { SocketListener } from 'router/utils';
import { emitErrorNotification } from 'services/notificationService';
import { addUserToRoom, removeUserFromRoom } from 'services/roomService';
import { validateShips } from 'services/shipValidationService';
import { Ship } from 'types/game';
import { RoomState, RoomUpdatePayload } from 'types/room';

export type RoomJoinPayload = {
  ships: Ship[];
};

export const roomJoinListener: SocketListener<RoomJoinPayload> =
  async function ({ payload, socket, io }) {
    logger.info(`Room join started.`, { socket });

    const user = await User.findById(socket.userId).orFail().exec();

    if (user.inRoom) {
      logger.error(`User already in a room.`, { socket });
      emitErrorNotification(socket, { content: 'User already in a room.' });
      return;
    }

    const shipsValid = validateShips(payload.ships);
    if (!shipsValid) {
      logger.error(`Invalid ships setup provided.`, { socket });
      emitErrorNotification(socket, {
        content: 'Invalid ships setup provided.',
      });
      return;
    }

    const room = await addUserToRoom(user, socket);
    await socket.join(room.id);

    if (room.users.length === 2) {
      const populatedRoom = await room.populate<Pick<IPopulatedRoom, 'users'>>(
        'users',
      );
      const rival = populatedRoom.users.find((u) => u.id !== user.id)!;

      const response: RoomUpdatePayload = {
        roomState: RoomState.READY,
        rivalData: {
          username: rival.username,
        },
      };
      const rivalResponse: RoomUpdatePayload = {
        roomState: RoomState.READY,
        rivalData: {
          username: user.username,
        },
      };

      socket.emit('room-update', response);
      io.to(rival.socketId!).emit('room-update', rivalResponse);
    } else {
      const response: RoomUpdatePayload = {
        roomState: RoomState.MATCHMAKING,
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
    emitErrorNotification(socket, { content: 'User not in a room.' });
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
      emitErrorNotification(socket, { content: 'User not in a room.' });
      return;
    }

    const response: RoomChatResponse = {
      message: payload.message,
      author: user.username,
    };

    io.in(user.roomId.toString()).emit('room-chat', response);
  };
