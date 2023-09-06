import { logger } from 'config/logger';
import { UserDocument, UserModel } from 'models/User';
import { ExtendedSocket } from 'router/middleware';
import { emitErrorNotification } from 'services/notificationService';
import { removeUserFromPool } from 'services/poolService';
import { removeUserFromRoom } from 'services/roomService';
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
    emitErrorNotification(otherSocket, {
      content: 'You connected from another place, this session will be closed.',
    });

    try {
      // deactivate other socket (disconnect controller must be disabled to avoid issues)
      otherSocket.removeAllListeners();
      otherSocket.disconnect();

      // perform standard disconnection cleanup
      await disconnectUserCleanup(user);
      await disconnectUser(user, socket);
    } catch (e) {
      logger.error('Error while disconnecting another active session.', {
        socket,
        error: e,
      });
    }
  }

  logger.info('Another active session closed.', { socket });
}

export async function disconnectUserCleanup(user: UserDocument) {
  if (user.inRoom) {
    await removeUserFromRoom(user);
  }
  if (user.inPool) {
    await removeUserFromPool(user);
  }
}

export async function disconnectUser(
  user: UserDocument,
  socket: ExtendedSocket,
) {
  user.socketId = undefined;
  await user.save();

  logger.info('User disconnected.', { socket, user });
}
