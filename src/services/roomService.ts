import { logger } from 'config/logger';
import {
  emitRoomJoin,
  emitRoomPlayerDisconnected,
  emitRoomPlayerLeft,
  emitRoomPlayerReconnected,
} from 'emitters/roomEmitter';
import { RoomModel } from 'models/Room';
import { UserDocument, UserModel } from 'models/User';
import { SocketProvider } from 'utils/socketProvider';
import { addUserToPool } from './poolService';

function createNewRoomUserValidator(user: UserDocument | null): string | void {
  if (!user) return 'User not found.';
  if (!user.isOnline) return 'User is offline.';
  if (user.inRoom) return 'User already in a room.';
}

export async function createNewRoom(userId1: string, userId2: string) {
  const user1 = (await UserModel.findById(userId1).exec())!;
  const user2 = (await UserModel.findById(userId2).exec())!;

  const userError1 = createNewRoomUserValidator(user1);
  const userError2 = createNewRoomUserValidator(user2);
  if (userError1 && userError2) {
    logger.error(
      'Both users are invalid. userId1: %s, userId2: %s',
      userId1,
      userId2,
    );
    return;
  } else if (userError1) {
    logger.error(
      'User1 is invalid. userId1: %s, userId2: %s',
      userId1,
      userId2,
    );
    await addUserToPool(user2);
    return;
  } else if (userError2) {
    logger.error(
      'User2 is invalid. userId1: %s, userId2: %s',
      userId1,
      userId2,
    );
    await addUserToPool(user1);
    return;
  }

  const socket1 = SocketProvider.getSocket(user1.socketId!)!;
  const socket2 = SocketProvider.getSocket(user2.socketId!)!;
  if (!socket1 && !socket2) {
    logger.error(
      'Both sockets are not connected. userId1: %s, userId2: %s',
      userId1,
      userId2,
    );
    return;
  } else if (!socket1) {
    logger.error(
      'Socket1 is not connected. userId1: %s, userId2: %s',
      userId1,
      userId2,
    );
    await addUserToPool(user2);
    return;
  } else if (!socket2) {
    logger.error(
      'Socket2 is not connected. userId1: %s, userId2: %s',
      userId1,
      userId2,
    );
    await addUserToPool(user1);
    return;
  }

  const room = await RoomModel.create({ users: [user1.id, user2.id] });
  await user1.updateOne({ roomId: room.id, poolId: undefined }).exec();
  await user2.updateOne({ roomId: room.id, poolId: undefined }).exec();

  socket1.join(room.id);
  socket2.join(room.id);

  emitRoomJoin(socket1, {
    rival: {
      username: user2.username,
    },
  });
  emitRoomJoin(socket2, {
    rival: {
      username: user1.username,
    },
  });
}

export function removeUserFromRoomValidator(user: UserDocument) {
  if (!user.inRoom) {
    return 'User not in a room.';
  }
}

export async function removeUserFromRoom(user: UserDocument) {
  const socket = SocketProvider.getSocket(user.socketId!);
  if (socket) {
    await socket.leave(user.roomId!);
  }

  const room = await RoomModel.findById(user.roomId).orFail().exec();
  if (room.users.length === 2) {
    room.removeUser(user);
    room.disabled = true;
    await room.save();

    emitRoomPlayerLeft(room.id, {
      player: {
        username: user.username,
      },
    });
  } else {
    await room.deleteOne();
  }

  user.roomId = undefined;
  await user.save();
}

export async function disconnectUserInRoom(user: UserDocument) {
  const room = await RoomModel.findById(user.roomId).orFail().exec();
  room.setUserDisconnected(user, true);
  await room.save();

  emitRoomPlayerDisconnected(room.id, {
    player: {
      username: user.username,
    },
  });
}

export async function reconnectUserInRoom(user: UserDocument) {
  const room = await RoomModel.findById(user.roomId).orFail().exec();
  room.setUserDisconnected(user, false);
  await room.save();

  emitRoomPlayerReconnected(room.id, {
    player: {
      username: user.username,
    },
  });
}
