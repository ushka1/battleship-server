import { Schema } from 'mongoose';
import { IPlayer } from '../player/Player';
import { IRoom, IRoomMethods, RoomModel } from './Room';

export function setupRoomMethods(
  schema: Schema<IRoom, RoomModel, IRoomMethods>,
) {
  schema.method('changeTurn', async function (this: IRoom) {
    if (this.turn === 1) {
      this.turn = 2;
    } else {
      this.turn = 1;
    }

    await this.save();
  });

  schema.method('addToRoom', async function (this: IRoom, player: IPlayer) {
    if (this.players.length >= 2) {
      throw new Error('The room is full.');
    }

    try {
      this.players.push(player.id);
      player.room = this.id;

      await this.save();
      await player.save();
    } catch (err) {
      throw new Error('An error occurred while adding player to the room.');
    }
  });

  schema.method(
    'removeFromRoom',
    async function (this: IRoom, playerId: string) {
      if (this.players.length < 2) {
        await this.deleteOne();
        return;
      }

      const updatedPlayers = this.players.filter(
        (id: string) => id.toString() !== playerId.toString(),
      );

      this.players = updatedPlayers;
      this.disabled = true;
      await this.save();
    },
  );
}
