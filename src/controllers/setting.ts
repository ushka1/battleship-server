import { ExtSocket } from './index';
import Player from '../models/Player';

type Response = {
  message?: string;
  board?: any;
};

const ships = {
  'ship-0': { size: 4 },
  'ship-2': { size: 3 },
  'ship-1': { size: 3 },
  'ship-3': { size: 2 },
  'ship-4': { size: 2 },
  'ship-5': { size: 2 },
  'ship-6': { size: 1 },
  'ship-7': { size: 1 },
  'ship-8': { size: 1 },
  'ship-9': { size: 1 },
};

type ShipKey = keyof typeof ships;
export type Board = {
  row: number;
  col: number;
  id: string;
  shipId: ShipKey;
}[][];

export const applySetting = async function (this: ExtSocket, board: Board) {
  try {
    const player = await Player.findById(this.playerId);

    if (!player) {
      throw new Error('User connection fault.');
    }

    const rowsLength = 10;
    const colsLength = 10;

    if (!board[rowsLength - 1] || !board[rowsLength - 1][colsLength - 1]) {
      throw new Error('User passed invalid setting.');
    }

    const foundShips: { [x: string]: any } = {};

    for (let row = 0; row < rowsLength; row++) {
      for (let col = 0; col < colsLength; col++) {
        const curCell = board[row][col];

        if (ships[curCell.shipId] && foundShips[curCell.shipId] === undefined) {
          foundShips[curCell.shipId] = shipProperlySettled(
            curCell.shipId,
            board,
            row,
            col,
          );
        }
      }
    }

    const settingValid = Object.keys(ships).reduce((acc, cur) => {
      if (!acc || !foundShips[cur]) return false;
      return true;
    }, true);

    if (!settingValid) {
      throw new Error('User passed invalid setting.');
    }

    const transformedBoard = board.map((row) => {
      return row.map((col) => ({ ...col, hit: false }));
    });

    player.board = transformedBoard;
    await player.save();

    const response: Response = {
      message: `Congratulations ${player.name}, your setting is right!`,
      board: transformedBoard,
    };

    this.emit('apply-setting', response);
  } catch (err) {
    console.error('Error in "controllers/setting.ts [applySetting]".');
    this.error({ message: err.message });
  }
};

//* Checks the validity of the board
const shipProperlySettled = (
  shipId: ShipKey,
  board: Board,
  row: number,
  col: number,
) => {
  const ship = ships[shipId];
  let orientation: string = '';

  if (ship.size === 1) {
    orientation = 'horizontal';
  } else {
    if (
      board[row] &&
      board[row][col + 1] &&
      board[row][col + 1].shipId === shipId
    ) {
      orientation = 'horizontal';
    } else if (
      board[row + 1] &&
      board[row + 1][col] &&
      board[row + 1][col].shipId === shipId
    ) {
      orientation = 'vertical';
    } else {
      return false;
    }
  }

  if (orientation === 'horizontal') {
    for (let k = col; k < ship.size + col; k++) {
      if (!board[row] || !board[row][k] || board[row][k].shipId !== shipId) {
        return false;
      }
    }

    for (let k = row - 1; k < row + 2; k++) {
      for (let l = col - 1; l < col + ship.size + 1; l++) {
        if (
          board[k] &&
          board[k][l] &&
          board[k][l].shipId !== shipId &&
          board[k][l].shipId !== null
        ) {
          return false;
        }
      }
    }
  } else if (orientation === 'vertical') {
    for (let k = row; k < row + ship.size; k++) {
      if (!board[k] || !board[k][col] || board[k][col].shipId !== shipId) {
        return false;
      }
    }

    for (let k = row - 1; k < row + ship.size + 1; k++) {
      for (let l = col - 1; l < col + 2; l++) {
        if (
          board[k] &&
          board[k][l] &&
          board[k][l].shipId !== shipId &&
          board[k][l].shipId !== null
        ) {
          return false;
        }
      }
    }
  }

  return true;
};
