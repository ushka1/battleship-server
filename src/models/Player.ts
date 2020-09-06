import { Schema, model, Document } from 'mongoose';

type Board = {
  row: number;
  col: number;
  id: string;
  shipId: null | string;
  hit: boolean;
}[][];
export interface IPlayer extends Document {
  name: string;
  socketId: string;
  room?: string;
  board?: Board;
  turn?: Number;
}

const playerSchema = new Schema<IPlayer>(
  {
    name: {
      type: String,
      required: true,
      maxlength: 15,
      minlength: 3,
    },
    socketId: {
      type: String,
      required: true,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
    },
    board: {
      type: Array,
    },
    turn: {
      type: Number,
    },
  },
  { autoCreate: true },
);

const Player = model<IPlayer>('Player', playerSchema);
Player.db.dropCollection('players', () => {});

export default Player;
