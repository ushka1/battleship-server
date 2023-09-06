import { prop } from '@typegoose/typegoose';

export class Board {
  @prop({ required: true })
  public gameBoard!: {
    shipId?: string;
    hit?: boolean;
  }[][];

  @prop({ required: true })
  public displayBoard!: number[][];

  public markHit(row: number, col: number) {
    this.gameBoard[row][col].hit = true;

    if (this.gameBoard[row][col].shipId) {
      this.displayBoard[row][col] = 2;
    } else {
      this.displayBoard[row][col] = 1;
    }
  }
}
