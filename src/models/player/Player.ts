import { Document, Model, Schema, model } from 'mongoose';
import { Board, Ship } from '../../services/settings/types';
import { setupPlayerMethods } from './methods';

export interface IPlayer extends Document {
  name: string;
  socketId: string;

  room?: string;
  ships?: Ship[];
  board?: Board;
  boardDefault?: Board;
  turnId?: number;
}

export interface IPlayerMethods {
  setDefaults: (board: Board) => Promise<void>;
  setNewGame: () => Promise<void>;
  resetGame: () => Promise<void>;
  handleHit: (row: number, col: number) => Promise<boolean>;
  hasShips: () => boolean;
}

export type PlayerModel = Model<IPlayer, object, IPlayerMethods>;

const schema = new Schema<IPlayer, PlayerModel, IPlayerMethods>(
  {
    name: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 32,
    },
    socketId: {
      type: String,
      required: true,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
    },
    ships: [
      {
        id: String,
        size: Number,
        hp: Number,
      },
    ],
    board: [
      [
        {
          row: Number,
          col: Number,
          id: String,
          shipId: String,
          hit: Boolean,
        },
      ],
    ],
    boardDefault: Array,
    turnId: Number,
  },
  { autoCreate: true },
);

setupPlayerMethods(schema);
export const Player = model<IPlayer, PlayerModel>('Player', schema);
