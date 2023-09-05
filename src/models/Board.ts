import { Document, Model, Schema, model } from 'mongoose';
import { markHit } from './methods/boardMethods';

export interface IBoard extends Document {
  gameBoard: {
    shipId?: string;
    hit?: boolean;
  }[][];
  displayBoard: number[][];
}

export interface IBoardMethods {
  markHit: (this: IBoard, x: number, y: number) => Promise<void>;
}

export type BoardModel = Model<IBoard, object, IBoardMethods>;

export const boardSchema = new Schema<IBoard, BoardModel, IBoardMethods>(
  {
    gameBoard: {
      type: [[{ shipId: String, hit: Boolean }]],
      required: true,
    },
    displayBoard: {
      type: [[Number]],
      required: true,
    },
  },
  { autoCreate: true },
);

boardSchema.method('markHit', markHit);

export const Board = model<IBoard, BoardModel>('Board', boardSchema);
