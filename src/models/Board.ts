import { Document, Schema } from 'mongoose';
import { markHit } from './methods/boardMethods';

/* ========================= DEF ========================= */

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

/* ========================= IMPL ========================= */

export const boardSchema = new Schema<IBoard, object, IBoardMethods>({
  gameBoard: {
    type: [
      [
        {
          type: { shipId: String, hit: Boolean },
          required: true,
        },
      ],
    ],
    required: true,
  },
  displayBoard: {
    type: [
      [
        Number, //
      ],
    ],
    required: true,
  },
});

boardSchema.method('markHit', markHit);
