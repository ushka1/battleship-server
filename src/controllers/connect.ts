import { ExtendedSocket } from '../services/socket/router';
import { ConnectResponse, DisconnectResponse } from '../types/responses';

import { Player } from '../models/player/Player';
import { Room } from '../models/room/Room';
import { SocketServerProvider } from '../services/socket/SocketServerProvider';

export const onConnect = async function (this: ExtendedSocket, name: string) {
  try {
    const player = await Player.create({ name, socketId: this.id });

    const response: ConnectResponse = {
      message: `Congratulations ${name}, you successfully connected to our game!`,
      player: { id: player.id, name: player.name },
    };

    this.playerId = player.id;
    this.emit('connect-player', response);

    this.on('disconnect', onDisconnect.bind(this));
  } catch (err) {
    console.error('Error in "controllers/connect.ts [onConnect]".');
    this._error({ message: 'User connection fault.' });
  }
};

const onDisconnect = async function (this: ExtendedSocket) {
  try {
    if (this.playerId) {
      if (this.roomId) {
        const remainingPlayer = await Player.findOne({
          _id: { $ne: this.playerId },
          room: this.roomId,
        }).exec();

        if (remainingPlayer) {
          await remainingPlayer.setNewGame();

          const response: DisconnectResponse = {
            message: "Your enemy couldn't stand it, he/she disconnected.",
            board: remainingPlayer.boardDefault,
            playerLeft: true,
          };

          const { io } = SocketServerProvider.getInstance();
          io.to(remainingPlayer.socketId).emit('enemy-disconnected', response);
        }

        const room = await Room.findById(this.roomId).exec();
        await room?.removePlayerFromRoom(this.playerId);
      }

      await Player.deleteOne({ _id: this.playerId }).exec();
    }
  } catch (err) {
    console.error(err);
  }
};
