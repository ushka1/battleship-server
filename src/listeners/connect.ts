import { IUser, User } from 'models/user/User';
import { ExtendedSocket } from 'router/utils';
import { sendErrorMessage } from 'services/messageChannels';

export type userConnectResponse = {
  user: { id: string; username: string };
};

export const userConnectHandler = async function (socket: ExtendedSocket) {
  console.log(`User connected (socket.id=${socket.id}).`);

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
    console.error('Unexpected connect error:', err);
    sendErrorMessage(socket, { message: 'OOPS!' });
  }
};
