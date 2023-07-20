import { Document, Model, Schema, model } from 'mongoose';
import { IPlayer } from '../player/Player';
import { setupRoomMethods } from './methods';

export interface IRoom extends Document {
  players: IPlayer['id'][];

  turn?: number;
  disabled?: boolean;
  private?: boolean;
}

export interface IRoomMethods {
  addToRoom: (player: IPlayer) => Promise<void>;
  removeFromRoom: (playerId: IPlayer['id']) => Promise<void>;
  changeTurn: () => Promise<void>;
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
    disabled: Boolean,
    private: Boolean,
  },
  { autoCreate: true },
);

setupRoomMethods(schema);
const Room = model<IRoom, RoomModel>('Room', schema);
export default Room;
