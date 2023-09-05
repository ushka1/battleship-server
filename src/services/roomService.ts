import socketio from 'socket.io';

import { logger } from 'config/logger';
import { Room } from 'models/Room';
import { IUser, User } from 'models/User';
import { RoomStatus, RoomUpdatePayload } from 'types/room';
import { UserStatus, UserUpdatePayload } from 'types/user';
import { SocketProvider } from 'utils/socketProvider';
import { startGame } from './gameService';
import { addUserToPool } from './poolService';

export async function addUsersToRoom(userId1: string, userId2: string) {
  const user1 = (await User.findById(userId1).exec())!;
  const user2 = (await User.findById(userId2).exec())!;

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

  const io = SocketProvider.getInstance().io;
  const socket1 = io.sockets.sockets.get(user1.socketId!);
  const socket2 = io.sockets.sockets.get(user2.socketId!);

  if (!socket1 || !socket2) {
    logger.error(`Socket not found.`);
    return;
  }

  const room = await Room.create({ users: [user1.id, user2.id] });
  await user1.updateOne({ roomId: room.id }).exec();
  await user2.updateOne({ roomId: room.id }).exec();

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

  // TODO: proceed to the game

  startGame(room.id);
}

function addUsersToRoomValidator(user: IUser | null): string | void {
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

export async function removeUserFromRoom(user: IUser, io: socketio.Server) {
  const room = await Room.findById(user.roomId).orFail().exec();

  if (room.users.length === 2) {
    await room.removeUser(user);

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

export function removeUserFromRoomValidator(user: IUser) {
  if (!user.inRoom) {
    return 'User not in a room.';
  }
}
