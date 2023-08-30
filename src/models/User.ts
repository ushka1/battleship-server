import { faker } from '@faker-js/faker';
import { Document, Model, Schema, Types, model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  isOnline: boolean;
  inPool: boolean;
  inRoom: boolean;

  socketId?: string;
  poolId?: string;
  roomId?: Types.ObjectId;
}

export interface IUserMethods {}

export type UserModel = Model<IUser, object, IUserMethods>;

const schema = new Schema<IUser, UserModel, IUserMethods>(
  {
    username: {
      type: String,
      required: true,
      default: () => faker.internet.userName(),
      minlength: 1,
      maxlength: 32,
    },
    socketId: {
      type: String,
    },
    poolId: {
      type: String,
    },
    roomId: {
      type: Types.ObjectId,
    },
  },
  { autoCreate: true },
);

schema.virtual('isOnline').get(function (this: IUser) {
  return !!this.socketId;
});

schema.virtual('inPool').get(function (this: IUser) {
  return !!this.poolId;
});

schema.virtual('inRoom').get(function (this: IUser) {
  return !!this.roomId;
});

export const User = model<IUser, UserModel>('User', schema);
