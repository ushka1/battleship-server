import { faker } from '@faker-js/faker';
import { IPlayer, Player } from '../models/player/Player';
import { SocketListener } from '../router/types';

type UserConnectRequest = object;
type UserConnectResponse = {
  user: { id: string; username: string };
};

export const userConnectListener: SocketListener<UserConnectRequest> =
  async function (socket) {
    try {
      let player: IPlayer | null = null;

      if (socket.playerId) {
        player = await Player.findById(socket.playerId);
      }

      if (!player) {
        player = await Player.create({
          username: faker.internet.userName(),
          socketId: socket.id,
        });
        socket.playerId = player.id;
      }

      const response: UserConnectResponse = {
        user: { id: player.id, username: player.username },
      };
      socket.emit('user-connect', response);
    } catch (err) {
      console.error('User connect error:', err);
      // socket._error({ message: 'User join error.' });
    }
  };
