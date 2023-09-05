import { faker } from '@faker-js/faker';
import { IShip } from 'models/Ship';
import { Document, Model, Schema, Types, model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  currentSetting?: IShip[];

  isOnline: boolean;
  inPool: boolean;
  inRoom: boolean;

  socketId?: string;
  poolId?: string;
  roomId?: Types.ObjectId;
}

export interface IUserMethods {}

export type UserModel = Model<IUser, object, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    username: {
      type: String,
      required: true,
      default: () => faker.internet.userName(),
      minlength: 1,
      maxlength: 32,
    },
    currentSetting: {
      type: [
        {
          id: String,
          row: Number,
          col: Number,
          size: Number,
          orientation: String,
        },
      ],
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

userSchema.virtual('isOnline').get(function (this: IUser) {
  return !!this.socketId;
});

userSchema.virtual('inPool').get(function (this: IUser) {
  return !!this.poolId;
});

userSchema.virtual('inRoom').get(function (this: IUser) {
  return !!this.roomId;
});

export const User = model<IUser, UserModel>('User', userSchema);
