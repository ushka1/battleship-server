import { User } from 'models/user/User';
import { SocketListener } from 'router/utils';
import { sendErrorMessage } from 'services/messageChannel';

export type RoomChatPayload = {
  message: string;
};
export type RoomChatResponse = {
  author: string;
  message: string;
};

export const roomChatListener: SocketListener<RoomChatPayload> =
  async function ({ socket, payload, io }) {
    const user = await User.findById(socket.userId).orFail().exec();
    if (!user.roomId) {
      sendErrorMessage(socket, { content: 'User not in a room.' });
      return;
    }

    const response: RoomChatResponse = {
      message: payload.message,
      author: user.username,
    };

    io.in(user.roomId.toString()).emit('room-chat', response);
  };
