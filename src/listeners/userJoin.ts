import { Player } from '../models/player/Player';
import { SocketListener } from '../services/socket/types';

type OnConnectPayload = { name: string };
type OnConnectResponse = {
  message: string;
  player: { id: string; name: string };
};

export const userJoinListener: SocketListener<OnConnectPayload> =
  async function (socket, payload) {
    const { name } = payload;

    try {
      const player = await Player.create({ name, socketId: socket.id });
      socket.playerId = player.id;

      const response: OnConnectResponse = {
        message: 'Player joined the game.',
        player: { id: player.id, name: player.name },
      };

      socket.emit('user-join', response);
    } catch (err) {
      console.error('Error in "controllers/connect.ts [onConnect]".');
      socket._error({ message: 'User connection fault.' });
    }
  };
