import { BOARD_COLS, BOARD_ROWS } from 'config/constants';
import { Ship } from 'models/Ship';

/**
 * Validates if ships can be placed on the board.
 */
export function validateShipsSetting(shipsSettting: Ship[]): boolean {
  const board = createEmptyBoard();

  if (shipsSettting.length !== 10) {
    return false;
  }

  for (const ship of shipsSettting) {
    const { id, row, col, size, orientation } = ship;

    if (orientation === 'h') {
      for (let i = col; i < col + size; i++) {
        if (!validateCellAndSurroundings(id, row, i, board)) {
          return false;
        }

        board[row][i] = ship.id;
      }
    }

    if (orientation === 'v') {
      for (let i = row; i < row + size; i++) {
        if (!validateCellAndSurroundings(id, i, col, board)) {
          return false;
        }

        board[i][col] = ship.id;
      }
    }
  }

  return true;
}

/**
 * Creates empty board.
 */
function createEmptyBoard(): string[][] {
  return Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(''));
}

/**
 * Validates if a ship can be placed in a cell.
 */
function validateCellAndSurroundings(
  id: string,
  row: number,
  col: number,
  board: string[][],
): boolean {
  // surroundings
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      // cell exists && is not ship id && is not empty
      if (
        board?.[i]?.[j] !== undefined &&
        board[i][j] !== id &&
        board[i][j] !== ''
      ) {
        return false;
      }
    }
  }

  // cell
  // cell exits && is empty
  return board?.[row]?.[col] !== undefined && board[row][col] === '';
}
