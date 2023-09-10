import { logger } from 'config/logger';
import { RoomModel } from 'models/Room';
import { UserDocument, UserModel } from 'models/User';
import { RoomStatus, RoomUpdatePayload } from 'types/payloads/room';
import { UserStatus, UserUpdatePayload } from 'types/payloads/user';
import { SocketProvider } from 'utils/socketProvider';
import { startNewGame } from './gameService';
import { addUserToPool } from './poolService';

export async function createNewRoom(userId1: string, userId2: string) {
  const user1 = (await UserModel.findById(userId1).exec())!;
  const user2 = (await UserModel.findById(userId2).exec())!;

  const userError1 = addUsersToRoomValidator(user1);
  const userError2 = addUsersToRoomValidator(user2);

  // TODO: better handling
  if (userError1 && userError2) {
    return;
  } else if (userError1) {
    await addUserToPool(user2);
    return;
  } else if (userError2) {
    await addUserToPool(user1);
    return;
  }

  const socket1 = SocketProvider.getSocket(user1.socketId!);
  const socket2 = SocketProvider.getSocket(user2.socketId!);

  if (!socket1 || !socket2) {
    logger.error(`Socket not found.`);
    return;
  }

  const room = await RoomModel.create({ users: [user1.id, user2.id] });
  await user1.updateOne({ roomId: room.id, poolId: undefined }).exec();
  await user2.updateOne({ roomId: room.id, poolId: undefined }).exec();

  socket1.join(room.id);
  socket2.join(room.id);

  const userPayload: UserUpdatePayload = {
    userStatus: UserStatus.ROOM,
  };

  socket1.emit('user-update', userPayload);
  socket2.emit('user-update', userPayload);

  const roomPayload1: RoomUpdatePayload = {
    roomStatus: RoomStatus.PLAYING,
    rivalData: {
      username: user2.username,
    },
  };

  const roomPayload2: RoomUpdatePayload = {
    roomStatus: RoomStatus.PLAYING,
    rivalData: {
      username: user1.username,
    },
  };

  socket1.emit('room-update', roomPayload1);
  socket2.emit('room-update', roomPayload2);

  startNewGame(room);
}

function addUsersToRoomValidator(user: UserDocument | null): string | void {
  if (!user) {
    return 'User not found.';
  }

  if (!user.isOnline) {
    return 'User is offline.';
  }

  if (user.inRoom) {
    return 'User already in a room.';
  }
}

export async function disconnectUserInRoom(user: UserDocument) {
  const room = await RoomModel.findById(user.roomId).orFail().exec();

  room.setUserDisconnected(user, true);
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

    const io = SocketProvider.getIO();
    const payload: RoomUpdatePayload = {
      roomStatus: RoomStatus.PLAYER_LEFT,
    };
    io.to(room.id).emit('room-update', payload);
  } else {
    await room.deleteOne();
  }

  user.roomId = undefined;
  await user.save();
}

export function removeUserFromRoomValidator(user: UserDocument) {
  if (!user.inRoom) {
    return 'User not in a room.';
  }
}
