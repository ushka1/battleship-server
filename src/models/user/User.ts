import { Document, Model, Schema, model } from 'mongoose';
import { Board, Ship } from '../../services/settings/types';
import { setupUserMethods } from './methods';

export interface IUser extends Document {
  username: string;
  socketId: string;

  room?: string;
  ships?: Ship[];
  board?: Board;
  boardDefault?: Board;
  turnId?: number;
}

export interface IUserMethods {
  setDefaults: (board: Board) => Promise<void>;
  setNewGame: () => Promise<void>;
  resetGame: () => Promise<void>;
  handleHit: (row: number, col: number) => Promise<boolean>;
  hasShips: () => boolean;
}

export type UserModel = Model<IUser, object, IUserMethods>;

const schema = new Schema<IUser, UserModel, IUserMethods>(
  {
    username: {
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

setupUserMethods(schema);
export const User = model<IUser, UserModel>('User', schema);
