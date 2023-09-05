import { Document, Model, Schema, Types, model } from 'mongoose';
import { IBoard, boardSchema } from './Board';
import { IShip, shipSchema } from './Ship';

export interface IGame extends Document {
  data: {
    userId: Types.ObjectId;
    board: IBoard;
    ships: IShip[];
  }[];
  turn: number;
}

export interface IGameMethods {}

export type GameModel = Model<IGame, object, IGameMethods>;

const gameSchema = new Schema<IGame, GameModel, IGameMethods>(
  {
    data: {
      type: [
        {
          userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          board: {
            type: boardSchema,
            required: true,
          },
          ships: {
            type: [
              {
                type: shipSchema,
                required: true,
              },
            ],
          },
        },
      ],
    },
  },
  { autoCreate: true },
);

export const Game = model<IGame, GameModel>('Game', gameSchema);
