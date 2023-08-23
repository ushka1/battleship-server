import { logger } from 'config/logger';
import { IRoom, Room } from 'models/room/Room';
import { IUser } from 'models/user/User';
import { ExtendedSocket } from 'router/utils';
import socketio from 'socket.io';

export async function addUserToRoom(
  user: IUser,
  socket: ExtendedSocket,
): Promise<IRoom> {
  let room = await Room.findOne({
    users: { $size: 1 },
    locked: false,
  }).exec();

  if (room) {
    await room.addUser(user);
    logger.info(`Room joined.`, { socket });
  } else {
    room = await Room.create({ users: [user.id] });
    logger.info(`Room created.`, { socket });
  }

  user.roomId = room.id;
  await user.save();

  return room;
}

export async function removeUserFromRoom(
  user: IUser,
  socket: ExtendedSocket,
  io: socketio.Server,
) {
  if (!user.inRoom) {
    logger.error('User not in a room.', { socket });
    return;
  }

  const room = await Room.findById(user.roomId).orFail().exec();
  await room.removeUser(user.id);

  if (room.users.length === 0) {
    await room.deleteOne();
  } else {
    io.in(room.id.toString()).emit('room-update', {
      message: 'Opponent left.',
      opponentLeft: true,
    });
  }

  user.roomId = undefined;
  await user.save();
}
