import { logger } from 'config/logger';
import { Room } from 'models/room/Room';
import { User } from 'models/user/User';
import { SocketListener } from 'router/utils';
import { sendErrorMessage } from 'services/messageChannels';
import { validateShips } from 'services/shipsValidation';
import { Ship } from 'types';

export type MatchmakingPayload = {
  ships: Ship[];
};
export type MatchmakingResponse = {
  //
};

export const startMatchmakingListener: SocketListener<MatchmakingPayload> =
  async function ({ payload, socket }) {
    if (socket.roomId) {
      logger.error(`User already in a room.`, { socket });
      sendErrorMessage(socket, { message: 'User already in a room.' });
      return;
    }

    logger.info(`Matchmaking started.`, { socket });

    const shipsValid = validateShips(payload.ships);
    if (!shipsValid) {
      logger.error(`Invalid ships provided.`, { socket });
      sendErrorMessage(socket, { message: 'Invalid ships provided.' });
      return;
    }

    const user = await User.findById(socket.userId).orFail().exec();

    let room = await Room.findOne({
      users: { $size: 1 },
      locked: false,
    }).exec();

    if (room) {
      await room.addUser(user.id);
      logger.info(`Room joined.`, { socket });
    } else {
      room = await Room.create({ users: [socket.userId] });
      logger.info(`Room created.`, { socket });
    }

    socket.roomId = room.id;
    await socket.join(room.id);

    // send message to user
  };

export const cancelMatchmakingListener: SocketListener = async function ({
  socket,
}) {
  if (!socket.userId || !socket.roomId) {
    logger.error(`User not in a room.`, { socket });
    sendErrorMessage(socket, { message: 'User not in a room.' });
    return;
  }

  const room = await Room.findById(socket.roomId).orFail().exec();
  await room.removeUser(socket.userId);

  await socket.leave(socket.roomId);
  socket.roomId = undefined;
};
