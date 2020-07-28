import { Schema, model, Document } from 'mongoose';
import { IRoom } from './Room';

export interface IPlayer extends Document {
  name: string;
  room?: string;
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
  },
  { autoCreate: true },
);

export default model<IPlayer>('Player', playerSchema);
