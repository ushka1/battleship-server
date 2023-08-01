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

export const matchmakingListener: SocketListener<MatchmakingPayload> =
  async function ({ payload, socket }) {
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
      logger.info(`Room found.`, { socket });
    } else {
      room = await Room.create({ users: [socket.userId] });
      logger.info(`Room created.`, { socket });
    }

    socket.roomId = room.id;
    await socket.join(room.id);

    // send message to user
  };
