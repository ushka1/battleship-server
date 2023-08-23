import { logger } from 'config/logger';
import { IUser, User } from 'models/user/User';
import { ExtendedSocket } from 'router/utils';
import socketio from 'socket.io';
import { emitErrorMessage } from './messageChannel';
import { removeUserFromRoom } from './room';

/**
 * Find user using the userId query param in the handshake.
 */
export async function findUserFromHandshake(
  socket: ExtendedSocket,
): Promise<IUser | null> {
  logger.info('Finding user.', { socket });

  let user: IUser | null = null;
  const userId = socket.handshake.query.userId as string;

  if (userId) {
    try {
      user = await User.findById(userId).exec();
    } catch (err) {
      logger.error('Invalid user id in query param.', {
        err,
        socket,
      });
    }
  }

  if (user) {
    logger.info('User found.', { socket, userId });
  } else {
    logger.info('User not found.', { socket, userId });
  }

  return user;
}

export async function createNewUser(socket: ExtendedSocket): Promise<IUser> {
  logger.info('Creating new user.', { socket });

  const user = await User.create({
    socketId: socket.id,
  });

  logger.info('New user created.', { socket });
  return user;
}

/**
 * Connect/reconnect user.
 * If the user is already connected, will be disconnected from older session.
 */
export async function connectUser(
  user: IUser,
  socket: ExtendedSocket,
  io: socketio.Server,
) {
  logger.info('Connecting user.', { socket });

  if (user.isOnline) {
    logger.info('Another active session found.', { socket });

    const otherSocket = io.sockets.sockets.get(user.socketId!);
    if (otherSocket) {
      emitErrorMessage(otherSocket, {
        content: 'Another active session was found.',
      });
      await disconnectUser(user, otherSocket, io);

      // deactivate other socket (especially disconnect listener)
      otherSocket.removeAllListeners();
      otherSocket.disconnect();
    }

    logger.info('Another active session closed.', { socket });
  }

  user.socketId = socket.id;
  await user.save();
}

export async function disconnectUser(
  user: IUser,
  socket: ExtendedSocket,
  io: socketio.Server,
) {
  logger.info('Disconnecting user.', { socket });

  if (user.inRoom) {
    try {
      await removeUserFromRoom(user, socket, io);
    } catch (err) {
      logger.error('Error while removing user from room.', { err, socket });
    }
  }

  user.socketId = undefined;
  await user.save();
}
