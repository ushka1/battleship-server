import { IPlayer, Player } from '../models/player/Player';
import { SocketListener } from '../router/types';

type UserJoinRequest = { username: string };
type UserJoinResponse = {
  player: { id: string; username: string };
};

export const userJoinListener: SocketListener<UserJoinRequest> =
  async function (socket, { username }) {
    try {
      let player: IPlayer | null = null;

      if (socket.playerId) {
        player = await Player.findById(socket.playerId);
      }

      if (!player) {
        player = await Player.create({
          username: username,
          socketId: socket.id,
        });
        socket.playerId = player.id;
      }

      const response: UserJoinResponse = {
        player: { id: player.id, username: player.username },
      };
      socket.emit('user-join', response);
    } catch (err) {
      console.error('User join error.', err);
      socket._error({ message: 'User join error.' });
    }
  };
