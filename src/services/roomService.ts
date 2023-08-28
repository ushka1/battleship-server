import { logger } from 'config/logger';
import { Room } from 'models/Room';
import { IUser, User } from 'models/User';
import socketio from 'socket.io';
import { RoomState, RoomUpdatePayload } from 'types/room';
import { SocketProvider } from '../utils/socketProvider';

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

export async function addUsersToRoom(userId1: string, userId2: string) {
  const user1 = (await User.findById(userId1).exec())!;
  const user2 = (await User.findById(userId2).exec())!;

  const user1Error = addUsersToRoomValidator(user1);
  const user2Error = addUsersToRoomValidator(user2);

  if (user1Error && user2Error) {
    // log
    return;
  } else if (user1Error) {
    // re-add user2 to pool
    return;
  } else if (user2Error) {
    // re-add user1 to pool
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
  socket1.join(room.id);
  socket2.join(room.id);

  const payload1: RoomUpdatePayload = {
    roomState: RoomState.PLAYING,
    rivalData: {
      username: user2.username,
    },
  };

  const payload2: RoomUpdatePayload = {
    roomState: RoomState.PLAYING,
    rivalData: {
      username: user1.username,
    },
  };

  socket1.emit('room-update', payload1);
  socket2.emit('room-update', payload2);

  // process to game
}

export async function removeUserFromRoomValidator(user: IUser) {
  if (!user) {
    return 'User not found.';
  }

  if (!user.inRoom) {
    return 'User not in a room.';
  }
}

export async function removeUserFromRoom(user: IUser, io: socketio.Server) {
  const room = await Room.findById(user.roomId).orFail().exec();

  if (room.users.length === 2) {
    await room.removeUser(user);

    const payload: RoomUpdatePayload = {
      roomState: RoomState.PLAYER_LEFT,
    };

    io.to(room.id).emit('room-update', payload);
  } else {
    await room.deleteOne();
  }

  user.roomId = undefined;
  await user.save();
}
