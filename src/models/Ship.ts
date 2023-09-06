import { Schema } from 'mongoose';

/* ========================= DEF ========================= */

export type IShip = {
  id: string;
  size: number;
  row: number;
  col: number;
  orientation: 'h' | 'v';
};

/* ========================= IMPL ========================= */

export const shipSchema = new Schema<IShip>({
  id: String,
  size: Number,
  row: Number,
  col: Number,
  orientation: {
    type: String,
    enum: ['h', 'v'],
  },
});
