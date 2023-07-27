import { faker } from '@faker-js/faker';
import { IUser, User } from '../models/user/User';
import { SocketListener } from '../router/types';

type UserConnectResponse = {
  user: { id: string; username: string };
};

export const userConnectListener: SocketListener = async function (socket) {
  console.log(`New user connected (socket.id=${socket.id}).`);

  try {
    let user: IUser | null = null;

    if (socket.userId) {
      user = await User.findById(socket.userId);
    }

    if (!user) {
      user = await User.create({
        username: faker.internet.userName(),
        socketId: socket.id,
      });
      socket.userId = user.id;
    }

    const response: UserConnectResponse = {
      user: { id: user.id, username: user.username },
    };
    socket.emit('user-connect', response);
  } catch (err) {
    console.error('User connect error:', err);
    // socket._error({ message: 'User join error.' });
  }
};
