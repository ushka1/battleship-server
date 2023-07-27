import { Document, Model, Schema, model } from 'mongoose';
import { IUser } from '../user/User';
import { setupRoomMethods } from './methods';

export interface IRoom extends Document {
  players: IUser['id'][];

  turn?: number;
  locked?: boolean;
  private?: boolean;
}

export interface IRoomMethods {
  addPlayerToRoom: (player: IUser) => Promise<void>;
  removePlayerFromRoom: (playerId: IUser['id']) => Promise<void>;
  switchTurns: () => Promise<void>;
}

export type RoomModel = Model<IRoom, object, IRoomMethods>;

const schema = new Schema<IRoom, RoomModel, IRoomMethods>(
  {
    players: {
      type: [
        {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Player',
        },
      ],
      required: true,
    },
    turn: Number,
    locked: Boolean,
    private: Boolean,
  },
  { autoCreate: true },
);

setupRoomMethods(schema);
export const Room = model<IRoom, RoomModel>('Room', schema);
