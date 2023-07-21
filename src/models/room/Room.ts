import { Document, Model, Schema, model } from 'mongoose';
import { IPlayer } from '../player/Player';
import { setupRoomMethods } from './methods';

export interface IRoom extends Document {
  players: IPlayer['id'][];

  turn?: number;
  locked?: boolean;
  private?: boolean;
}

export interface IRoomMethods {
  addPlayerToRoom: (player: IPlayer) => Promise<void>;
  removePlayerFromRoom: (playerId: IPlayer['id']) => Promise<void>;
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
