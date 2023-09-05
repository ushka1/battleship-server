import { Schema } from 'mongoose';

export type IShip = {
  id: string;
  size: number;
  row: number;
  col: number;
  orientation: 'h' | 'v';
};

export const shipSchema = new Schema<IShip>({
  id: String,
  size: Number,
  row: Number,
  col: Number,
  orientation: String,
});
