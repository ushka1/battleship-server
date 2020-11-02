import { Schema, model, Document, startSession } from 'mongoose';
import { IPlayer } from './Player';

export interface IRoom extends Document {
  players: IPlayer['id'][];
  turn?: number;
  disabled?: boolean;
  private?: boolean;
  addToRoom: (player: IPlayer) => Promise<void>;
  removeFromRoom: (playerId: IPlayer['id']) => Promise<void>;
  changeTurn: () => Promise<void>;
}

const roomSchema = new Schema<IRoom>(
  {
    players: {
      type: [
        {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Player',
        },
      ],
      required: true,
    },
    turn: Number,
    disabled: Boolean,
    private: Boolean,
  },
  { autoCreate: true },
);

roomSchema.methods.changeTurn = async function () {
  if (this.turn === 1) {
    this.turn = 2;
  } else if (this.turn === 2) {
    this.turn = 1;
  }

  await this.save();
};

roomSchema.methods.addToRoom = async function (player) {
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
};

roomSchema.methods.removeFromRoom = async function (playerId: string) {
  if (this.players.length <= 1) {
    await this.remove();
    return;
  }

  const updatedPlayers = this.players.filter(
    (id) => id.toString() !== playerId.toString(),
  );

  this.players = updatedPlayers;
  this.disabled = true;
  await this.save();
};

const Room = model<IRoom>('Room', roomSchema);
Room.db.dropCollection('rooms', () => {});

export default Room;
