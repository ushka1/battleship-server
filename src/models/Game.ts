import { Document, Model, Schema, Types, model } from 'mongoose';
import { IBoard, IBoardMethods, boardSchema } from './Board';
import { IShip, shipSchema } from './Ship';

/* ========================= DEF ========================= */

export interface IGame extends Document {
  data: {
    user: Types.ObjectId;
    board: IBoard & IBoardMethods;
    ships: IShip[];
  }[];
  turn: number;
}

export interface IGameMethods {}

export type GameModel = Model<IGame, object, IGameMethods>;

/* ========================= IMPL ========================= */

const gameSchema = new Schema<IGame, GameModel, IGameMethods>(
  {
    data: {
      type: [
        {
          user: {
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
            required: true,
          },
        },
      ],
    },
  },
  { autoCreate: true },
);

export const Game = model<IGame, GameModel>('Game', gameSchema);
