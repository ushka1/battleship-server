import { ExtSocket } from '../routes/index';
import { ConnectResponse, DisconnectResponse } from '../utils/responses';

import { Socket } from '../utils/Socket';
import Player from '../models/Player';
import Room from '../models/Room';

export const onConnect = async function (this: ExtSocket, name: string) {
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
    this.error({ message: 'User connection fault.' });
  }
};

const onDisconnect = async function (this: ExtSocket) {
  try {
    if (this.playerId) {
      if (this.roomId) {
        const remainingPlayer = await Player.findOne({
          _id: { $ne: this.playerId },
          room: this.roomId,
        });

        if (remainingPlayer) {
          await remainingPlayer.setNewGame();

          const response: DisconnectResponse = {
            message: "Your enemy couldn't stand it, he/she disconnected.",
            board: remainingPlayer.boardDefault,
            playerLeft: true,
          };

          const { io } = Socket.getInstance();
          io.to(remainingPlayer.socketId).emit('disconnect', response);
        }

        const room = await Room.findById(this.roomId);
        await room?.removeFromRoom(this.playerId);
      }

      await Player.deleteOne({ _id: this.playerId });
    }
  } catch (err) {
    console.error('Error in "controllers/connect.ts [onDisconnect]".');
  }
};
