import { IUser, User } from 'models/user/User';
import { ExtendedSocket } from 'router/utils';

export type userConnectResponse = {
  user: { id: string; username: string };
};

export const userConnectHandler = async function (socket: ExtendedSocket) {
  console.log(`New user connected (socket.id=${socket.id}).`);

  try {
    let user: IUser | null = null;

    if (socket.userId) {
      user = await User.findById(socket.userId).exec();
    }

    if (!user) {
      user = await User.create({
        socketId: socket.id,
      });
      socket.userId = user.id;
    }

    const response: userConnectResponse = {
      user: { id: user.id, username: user.username },
    };
    socket.emit('user-connect', response);
  } catch (err) {
    console.error('User connect error:', err);
    // socket._error({ message: 'User join error.' });
  }
};
