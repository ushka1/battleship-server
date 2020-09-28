import { Schema, model, Document } from 'mongoose';
import { shipsDefault } from '../utils/settingUtils';

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
  ships?: typeof shipsDefault;
  board?: Board;
  boardDefault?: Board;
  turnId?: Number;
  setDefaults: (board: Board) => Promise<void>;
  setNewGame: () => Promise<void>;
  resetGame: () => Promise<void>;
  handleHit: (row: number, col: number) => Promise<boolean>;
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
    boardDefault: {
      type: Array,
    },
    turnId: {
      type: Number,
    },
  },
  { autoCreate: true },
);

playerSchema.methods.setDefaults = async function (board: Board) {
  this.boardDefault = board;
  await this.save();
};

playerSchema.methods.setNewGame = async function () {
  if (!this.boardDefault) throw new Error('An unexpected error occurred.');

  this.board = this.boardDefault;
  this.ships = shipsDefault;
  await this.save();
};

playerSchema.methods.resetGame = async function () {
  await this.updateOne([
    { $unset: ['ships', 'board', 'boardDefault', 'room', 'turnId'] },
  ]);
};

playerSchema.methods.handleHit = async function (row, col) {
  if (!this.board) {
    throw new Error('An unexpected error occurred.');
  }

  let shipHitted = false;
  if (this.board[row][col].shipId) {
    shipHitted = true;
  }

  this.board[row][col].hit = true;
  await this.save();

  return shipHitted;
};

const Player = model<IPlayer>('Player', playerSchema);
Player.db.dropCollection('players', () => {});

export default Player;
