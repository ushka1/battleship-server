import { Schema, model, Document, startSession } from 'mongoose';
import { IPlayer } from './Player';

export interface IRoom extends Document {
  players: IPlayer['id'][];
  addToRoom: (player: IPlayer) => Promise<void>;
  removeFromRoom: (playerId: IPlayer['id']) => Promise<void>;
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
  },
  { autoCreate: true },
);

// tslint:disable-next-line: only-arrow-functions
roomSchema.methods.addToRoom = async function (player) {
  if (this.players.length >= 2) {
    throw new Error('Room is full already');
  }

  this.players.push(player.id);
  player.room = this.id;

  try {
    //TO CHANGE!!!!!!!!!!!!!!!
    // const session = await startSession();
    // session.startTransaction();

    // await this.save({ session });
    // await player.save({ session });

    // await session.commitTransaction();
    // session.endSession();

    await this.save();
    await player.save();
  } catch (err) {
    throw new Error('An unexpected error occurred');
  }
};

roomSchema.methods.removeFromRoom = async function (playerId) {
  if (this.players.length <= 1) {
    await this.remove();
    return;
  }

  const playersUpdate = this.players.filter(
    (id) => id.toString() !== playerId.toString(),
  );
  this.players = playersUpdate;

  await this.save();
};

const Room = model<IRoom>('Room', roomSchema);
Room.db.dropCollection('rooms', () => {});

export default Room;
