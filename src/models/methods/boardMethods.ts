import { IBoardMethods } from 'models/Board';

export const markHit: IBoardMethods['markHit'] = async function (x, y) {
  this.gameBoard[x][y].hit = true;

  if (this.gameBoard[x][y].shipId) {
    this.displayBoard[x][y] = 2;
  } else {
    this.displayBoard[x][y] = 1;
  }

  await this.save();
};
