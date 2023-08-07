import { Room } from 'models/room/Room';
import { IUser } from 'models/user/User';
import { ExtendedSocket } from 'router/utils';
import socketio from 'socket.io';

export async function removeUserFromRoom(
  user: IUser,
  socket: ExtendedSocket,
  io: socketio.Server,
) {
  if (!user.roomId) {
    throw new Error('User not in a room.');
  }

  const room = await Room.findById(user.roomId).orFail().exec();
  await room.removeUser(user.id);

  if (room.users.length === 0) {
    await room.deleteOne();
  } else {
    io.in(room.id.toString()).emit('room-update', {
      message: 'Opponent left.',
    });
  }

  user.roomId = undefined;
}
