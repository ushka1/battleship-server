import { logger } from 'config/logger';
import { User } from 'models/user/User';
import { SocketListener } from 'router/utils';
import { emitErrorMessage } from 'services/messageChannel';
import { addUserToRoom, removeUserFromRoom } from 'services/room';
import { validateShips } from 'services/shipsValidation';
import { Ship } from 'types';

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
      const response: MatchmakingResponse = {
        gameReady: true,
      };
      io.in(room.id.toString()).emit('matchmaking-start', response);
    } else {
      const response: MatchmakingResponse = {
        gameReady: false,
      };
      socket.emit('matchmaking-start', response);
    }
  };

export const cancelMatchmakingListener: SocketListener = async function ({
  socket,
  io,
}) {
  logger.info(`Matchmaking cancelled.`, { socket });

  const user = await User.findById(socket.userId).orFail().exec();
  if (!user.inRoom) {
    logger.error(`User not in a room.`, { socket });
    emitErrorMessage(socket, { content: 'User not in a room.' });
    return;
  }

  await socket.leave(user.roomId!.toString());
  await removeUserFromRoom(user, socket, io);
};
