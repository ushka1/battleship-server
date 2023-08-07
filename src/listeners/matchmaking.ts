import { logger } from 'config/logger';
import { Room } from 'models/room/Room';
import { User } from 'models/user/User';
import { SocketListener } from 'router/utils';
import { Ship } from 'types';
import { emitErrorMessage } from 'utils/messageChannel';
import { validateShips } from 'utils/shipsValidation';

export type MatchmakingPayload = {
  ships: Ship[];
};
export type MatchmakingResponse = {
  gameReady: boolean;
};

export const startMatchmakingListener: SocketListener<MatchmakingPayload> =
  async function ({ payload, socket, io }) {
    logger.info(`Matchmaking started.`, { socket });

    const user = await User.findById(socket.userId).orFail().exec();

    if (user.roomId) {
      logger.error(`User already in a room.`, { socket });
      emitErrorMessage(socket, { content: 'User already in a room.' });
      return;
    }

    const areShipsValid = validateShips(payload.ships);
    if (!areShipsValid) {
      logger.error(`Invalid ships provided.`, { socket });
      emitErrorMessage(socket, { content: 'Invalid ships provided.' });
      return;
    }

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

    user.roomId = room.id;
    await user.save();

    await socket.join(room.id);

    if (room.users.length === 2) {
      const response: MatchmakingResponse = {
        gameReady: true,
      };
      io.in(room.id.toString()).emit('matchmaking-start', response);
    }
  };

export const cancelMatchmakingListener: SocketListener = async function ({
  socket,
}) {
  const user = await User.findById(socket.userId).orFail().exec();

  if (!user.roomId) {
    logger.error(`User not in a room.`, { socket });
    emitErrorMessage(socket, { content: 'User not in a room.' });
    return;
  }

  const room = await Room.findById(user.roomId).orFail().exec();
  await room.removeUser(user.id);

  await socket.leave(user.roomId.toString());
  user.roomId = undefined;
  await user.save();
};
