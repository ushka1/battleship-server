import { Room } from 'models/room/Room';
import { User } from 'models/user/User';
import { SocketListener } from 'router/utils';
import { sendErrorMessage } from 'services/messageChannels';
import { validateShips } from 'services/shipsValidation';
import { Ship } from 'types';

export type MatchmakingPayload = {
  ships: Ship[];
};
export type MatchmakingResponse = {
  //
};

export const matchmakingListener: SocketListener<MatchmakingPayload> =
  async function ({ payload, socket }) {
    console.log(`Matchmaking started (socket.id=${socket.id}).`);

    const shipsValid = validateShips(payload.ships);
    if (!shipsValid) {
      console.log(`Invalid ships provided (socket.id=${socket.id}).`);
      sendErrorMessage(socket, { message: 'OOPS!' });
      return;
    }

    const user = await User.findById(socket.userId).exec();
    if (!user) {
      console.log(`User not found (socket.id=${socket.id}).`);
      sendErrorMessage(socket, { message: 'OOPS!' });
      return;
    }

    let room = await Room.findOne({
      users: { $size: 1 },
      locked: false,
    }).exec();

    if (room) {
      await room.addUser(user.id);
      console.log(`Room found (socket.id=${socket.id}).`);
    } else {
      room = await Room.create({ users: [socket.userId] });
      console.log(`Room created (socket.id=${socket.id}).`);
    }

    socket.roomId = room.id;
    await socket.join(room.id);

    // send message to user
  };
