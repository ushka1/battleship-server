import { Room } from 'models/room/Room';
import { User } from 'models/user/User';
import { SocketListener } from 'router/utils';

export const userDisconnectListener: SocketListener = async function ({
  socket,
}) {
  console.log(`User disconnected (socket.id=${socket.id}).`);

  const user = await User.findById(socket.userId).exec();
  if (!user) return;

  if (socket.roomId) {
    socket.leave(socket.roomId);

    const room = await Room.findById(socket.roomId).exec();
    if (room) await room.removeUser(user);
  }

  await user.deleteOne();
};
