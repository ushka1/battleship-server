import { Schema, model, Document } from 'mongoose';
import {
  shipsDefaultArray,
  ShipKey,
  sunkShip,
  Board,
} from '../utils/settingUtils';

export interface IPlayer extends Document {
  name: string;
  socketId: string;
  room?: string;
  ships?: { id: string; size: number; hp: number }[];
  board?: Board;
  boardDefault?: Board;
  turnId?: number;
  setDefaults: (board: Board) => Promise<void>;
  setNewGame: () => Promise<void>;
  resetGame: () => Promise<void>;
  handleHit: (row: number, col: number) => Promise<boolean>;
  hasShips: () => boolean;
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
    boardDefault: Array,
    turnId: Number,
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
  this.ships = shipsDefaultArray;
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

  if (this.board[row][col].hit) {
    return true;
  }

  let shipHitted = false;
  const shipId = this.board[row][col].shipId as ShipKey;

  if (shipId) {
    const ship = this.ships?.find((ship) => ship.id === shipId)!;
    ship.hp--;

    if (ship.hp <= 0) {
      sunkShip(this.board, shipId);
    }

    shipHitted = true;
  }

  this.board[row][col].hit = true;
  await this.save();

  return shipHitted;
};

playerSchema.methods.hasShips = function () {
  const allShipsSunked = this.ships!.reduce((acc, cur) => {
    if (acc && cur.hp <= 0) {
      return true;
    } else {
      return false;
    }
  }, true);

  return !allShipsSunked;
};

const Player = model<IPlayer>('Player', playerSchema);
Player.db.dropCollection('players', () => {});

export default Player;
