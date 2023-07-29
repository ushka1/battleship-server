import { User } from 'models/user/User';
import { SocketListener } from 'router/utils';

export const userDisconnectListener: SocketListener = async function ({
  socket,
}) {
  console.log(`User disconnected (socket.id=${socket.id}).`);

  if (!socket.userId) {
    return;
  }

  try {
    await User.deleteOne({ _id: socket.userId }).exec();
  } catch (err) {
    console.error('User disconnect error:', err);
  }
};
