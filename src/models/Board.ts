import { prop } from '@typegoose/typegoose';

type BoardCell = {
  shipId?: string;
  hit?: boolean;
};

export class Board {
  @prop({ required: true })
  public matrix!: BoardCell[][];
}
