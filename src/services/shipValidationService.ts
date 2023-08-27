import { BOARD_COLS, BOARD_ROWS } from 'config/constants';
import { Ship } from 'types/game';

/**
 * Creates empty board.
 */
function createEmptyShipBoard(): string[][] {
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
) {
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

/**
 * Validates if ships can be placed on the board.
 */
export function validateShips(ships: Ship[]): boolean {
  const board = createEmptyShipBoard();

  for (const s of ships) {
    const { id, row, col, size, orientation } = s;

    if (orientation === 'h') {
      for (let i = col; i < col + size; i++) {
        if (!validateCellAndSurroundings(id, row, i, board)) {
          return false;
        }

        board[row][i] = s.id;
      }
    }

    if (orientation === 'v') {
      for (let i = row; i < row + size; i++) {
        if (!validateCellAndSurroundings(id, i, col, board)) {
          return false;
        }

        board[i][col] = s.id;
      }
    }
  }

  return true;
}
