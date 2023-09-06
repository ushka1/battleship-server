import { Document, Model, Schema, Types, model } from 'mongoose';

import { IUser } from 'models/User';
import { addUser, removeUser } from 'models/methods/roomMethods';

/* ========================= DEF ========================= */

export interface IRoom extends Document {
  users: Types.ObjectId[];
  locked?: boolean;
}

export interface IPopulatedRoom {
  users: IUser[];
}

export interface IRoomMethods {
  addUser: (this: IRoom, user: IUser) => Promise<void>;
  removeUser: (this: IRoom, user: IUser) => Promise<void>;
}

export type RoomModel = Model<IRoom, object, IRoomMethods>;

/* ========================= IMPL ========================= */

const roomSchema = new Schema<IRoom, RoomModel, IRoomMethods>(
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

roomSchema.method('addUser', addUser);
roomSchema.method('removeUser', removeUser);

export const Room = model<IRoom, RoomModel>('Room', roomSchema);
