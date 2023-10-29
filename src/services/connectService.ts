import { logger } from 'config/logger';
import { GameModel } from 'models/Game';
import { RoomModel } from 'models/Room';
import { UserDocument, UserModel } from 'models/User';
import { ExtendedSocket } from 'router/middleware';
import { emitErrorNotification } from 'services/notificationService';
import { RoomUpdateResponse } from 'types/payloads/room';
import { SocketProvider } from 'utils/socketProvider';

/* ========================= CONNECT ========================= */

/**
 * Find user using the userId query param in the handshake.
 */
export async function findUserFromHandshake(
  socket: ExtendedSocket,
): Promise<UserDocument | void> {
  const userId = socket.handshake.query.userId as string;

  if (userId) {
    try {
      const user = await UserModel.findById(userId).orFail().exec();
      logger.info('User found from handshake.', { socket, user });
      return user;
    } catch (e) {
      logger.error('Error while finding user from handshake.', {
        socket,
      });
    }
  }

  logger.error('User not found from handshake.', { socket });
}

/**
 * Create new user.
 */
export async function createNewUser(
  socket: ExtendedSocket,
): Promise<UserDocument> {
  const user = await UserModel.create({
    socketId: socket.id,
  });

  logger.info('New user created.', { socket, user });
  return user;
}

export async function connectUser(user: UserDocument, socket: ExtendedSocket) {
  user.socketId = socket.id;
  await user.save();

  logger.info('User connected.', { socket, user });
}

/* ========================= DISCONNECT ========================= */

/**
 * Disconnect another active session of the user.
 */
export async function disconnectUserFromAnotherSession(
  user: UserDocument,
  socket: ExtendedSocket,
) {
  logger.info('Another active session found.', { socket });

  const otherSocket = SocketProvider.getSocket(user.socketId!);
  if (otherSocket) {
    // change this to some payload that will cause app close
    emitErrorNotification(otherSocket, {
      content: 'You connected from another place, this session will be closed.',
    });

    try {
      // deactivate other socket (disconnect controller must be disabled to avoid issues)
      otherSocket.removeAllListeners();
      otherSocket.disconnect();

      // perform standart reconnection
      await reconnectUser(user, socket);
    } catch (e) {
      logger.error('Error while disconnecting another active session.', {
        socket,
        error: e,
      });
    }
  }

  logger.info('Another active session closed.', { socket });
}

export async function disconnectUser(
  user: UserDocument,
  socket: ExtendedSocket,
) {
  user.socketId = undefined;
  await user.save();

  logger.info('User disconnected.', { socket, user });
}

/* ========================= RECONNECT ========================= */

export async function reconnectUser(
  user: UserDocument,
  socket: ExtendedSocket,
) {
  if (user.inRoom) {
    const room = await RoomModel.findById(user.roomId).orFail().exec();
    const rival = await UserModel.findById(room.getRival(user)).orFail().exec();

    if (room.inGame) {
      const game = await GameModel.findById(room.gameId).orFail().exec();

      if (game.isFinished) {
        //
      } else {
        const userTurn = game.isUserTurn(user.id);
        //
      }
    }

    const roomPayload: RoomUpdateResponse = {
      rivalData: {
        username: rival.username,
      },
    };
    socket.emit('room-update', roomPayload);
  }

  user.socketId = socket.id;
  await user.save();

  logger.info('User reconnected.', { socket, user });
}
