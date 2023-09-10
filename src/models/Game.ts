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

  /* ========================= HELPERS ========================= */

  public get isFinished(): boolean {
    return !!this.winner;
  }

  public isUserTurn(userId: string): boolean {
    const userIndex = this.data.findIndex((d) => d.user === userId);
    return userIndex === this.turn;
  }
}

export type GameDocument = DocumentType<Game>;
export const GameModel = getModelForClass(Game);
