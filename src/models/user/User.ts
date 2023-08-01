import { faker } from '@faker-js/faker';
import { Document, Model, Schema, model } from 'mongoose';


export interface IUser extends Document {
  username: string;
  socketId: string;
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
      required: true,
    },
  },
  { autoCreate: true },
);

export const User = model<IUser, UserModel>('User', schema);
