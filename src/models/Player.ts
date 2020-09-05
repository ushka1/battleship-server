import { Schema, model, Document } from 'mongoose';
import { IRoom } from './Room';

type Board = {
  row: number;
  col: number;
  id: string;
  shipId: null | string;
  hit: boolean;
}[][];
export interface IPlayer extends Document {
  name: string;
  room?: string;
  board?: Board;
}

const playerSchema = new Schema<IPlayer>(
  {
    name: {
      type: String,
      required: true,
      maxlength: 15,
      minlength: 3,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
    },
    board: {
      type: Array,
    },
  },
  { autoCreate: true },
);

const Player = model<IPlayer>('Player', playerSchema);
Player.db.dropCollection('players', () => {});

export default Player;
