import { BOARD_COLS, BOARD_ROWS } from '../../config/constants';
import { defaultFleet } from './helpers';
import { Board, ShipKey } from './types';

function getShipOrientation(
  board: Board,
  row: number,
  col: number,
  shipId: ShipKey,
): string {
  const ship = defaultFleet[shipId];

  if (ship.size === 1) {
    return 'horizontal';
  } else {
    if (
      board[row] &&
      board[row][col + 1] &&
      board[row][col + 1].shipId === shipId
    ) {
      return 'horizontal';
    } else if (
      board[row + 1] &&
      board[row + 1][col] &&
      board[row + 1][col].shipId === shipId
    ) {
      return 'vertical';
    } else {
      throw new Error('Invalid ship position.');
    }
  }
}

export function validateShipPosition(
  board: Board,
  row: number,
  col: number,
  shipId: ShipKey,
): boolean {
  const ship = defaultFleet[shipId];
  const orientation = getShipOrientation(board, row, col, shipId);

  if (orientation === 'horizontal') {
    // check ship position
    if (row < 0 || row >= BOARD_ROWS) return false;
    if (col < 0 || col + ship.size - 1 >= BOARD_COLS) return false;

    for (let i = col; i <= col + ship.size - 1; i++) {
      if (board[row][i].shipId !== shipId) {
        return false;
      }
    }

    // check ship surroundings
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + ship.size; j++) {
        if (
          board[i] &&
          board[i][j] &&
          board[i][j].shipId !== null &&
          board[i][j].shipId !== shipId
        ) {
          return false;
        }
      }
    }
  }

  if (orientation === 'vertical') {
    // check ship position
    if (row < 0 || row + ship.size - 1 >= BOARD_ROWS) return false;
    if (col < 0 || col >= BOARD_COLS) return false;

    for (let i = row; i < row + ship.size; i++) {
      if (board[i][col].shipId !== shipId) {
        return false;
      }
    }

    // check ship surroundings
    for (let i = row - 1; i <= row + ship.size; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (
          board[i] &&
          board[i][j] &&
          board[i][j].shipId !== null &&
          board[i][j].shipId !== shipId
        ) {
          return false;
        }
      }
    }
  }

  return true;
}
