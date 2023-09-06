import { faker } from '@faker-js/faker';
import { InferSchemaType, Schema, Types, model } from 'mongoose';
import { boardSchema } from './Board';

/* ========================= IMPL ========================= */

const userSchema = new Schema(
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
    pin: {
      type: boardSchema,
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

type UserProperties = InferSchemaType<typeof userSchema>;

export const User = model<IUser, UserModel>('User', userSchema);
