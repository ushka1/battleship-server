import { Schema } from 'mongoose';
import { IUser } from '../user/User';
import { IRoom, IRoomMethods, RoomModel } from './Room';

export function setupRoomMethods(
  schema: Schema<IRoom, RoomModel, IRoomMethods>,
) {
  schema.method('switchTurns', async function (this: IRoom) {
    if (this.turn === 1) {
      this.turn = 2;
    } else {
      this.turn = 1;
    }

    await this.save();
  });

  schema.method('addPlayerToRoom', async function (this: IRoom, player: IUser) {
    if (this.players.length >= 2) {
      throw new Error('This room is full.');
    }

    this.players.push(player.id);
    await this.save();

    player.room = this.id;
    await player.save();
  });

  schema.method(
    'removePlayerFromRoom',
    async function (this: IRoom, playerId: string) {
      const updatedPlayers = this.players.filter(
        (id) => id.toString() !== playerId.toString(),
      );

      if (updatedPlayers.length === 0) {
        await this.deleteOne();
        return;
      }

      this.players = updatedPlayers;
      this.locked = true;
      await this.save();
    },
  );
}
