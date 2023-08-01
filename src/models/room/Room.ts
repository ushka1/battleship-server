import { Document, Model, Schema, Types, model } from 'mongoose';
import { addUser, removeUser } from './methods';

export interface IRoom extends Document {
  users: Types.ObjectId[];
  locked?: boolean;
}

export interface IRoomMethods {
  addUser: (this: IRoom, userId: string | Types.ObjectId) => Promise<void>;
  removeUser: (this: IRoom, userId: string | Types.ObjectId) => Promise<void>;
}

export type RoomModel = Model<IRoom, object, IRoomMethods>;

const schema = new Schema<IRoom, RoomModel, IRoomMethods>(
  {
    users: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      required: true,
    },
    locked: {
      type: Boolean,
      default: false,
    },
  },
  { autoCreate: true },
);

schema.method('addUser', addUser);
schema.method('removeUser', removeUser);

export const Room = model<IRoom, RoomModel>('Room', schema);
