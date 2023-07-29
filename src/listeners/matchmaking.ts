import { SocketListener } from 'router/utils';
import { validateShips } from 'services';
import { Ship } from 'types';

export type MatchmakingPayload = {
  ships: Ship[];
};
export type MatchmakingResponse = {
  //
};

export const matchmakingListener: SocketListener<MatchmakingPayload> =
  async function ({ payload, socket }) {
    console.log(`User started matchmaking (socket.id=${socket.id}).`);

    const isValid = validateShips(payload.ships);

    console.log(`User ships are ${isValid ? 'valid' : 'invalid'}.`);
  };
