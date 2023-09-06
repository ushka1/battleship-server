import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose';

import { Board } from './Board';
import { Ship } from './Ship';

class Game {
  @prop({ required: true, default: [] })
  public data!: {
    user: string;
    board: Board;
    ships: Ship[];
  }[];

  @prop()
  public winner?: string;

  @prop({ required: true })
  public turn!: number;
}

export type GameDocument = DocumentType<Game>;
export const GameModel = getModelForClass(Game);
