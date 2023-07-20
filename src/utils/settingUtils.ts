export const rows = 10;
export const columns = 10;

export const shipsDefaultState = {
  'ship-0': { id: 'ship-0', size: 4, hp: 4 },
  'ship-2': { id: 'ship-2', size: 3, hp: 3 },
  'ship-1': { id: 'ship-1', size: 3, hp: 3 },
  'ship-3': { id: 'ship-3', size: 2, hp: 2 },
  'ship-4': { id: 'ship-4', size: 2, hp: 2 },
  'ship-5': { id: 'ship-5', size: 2, hp: 2 },
  'ship-6': { id: 'ship-6', size: 1, hp: 1 },
  'ship-7': { id: 'ship-7', size: 1, hp: 1 },
  'ship-8': { id: 'ship-8', size: 1, hp: 1 },
  'ship-9': { id: 'ship-9', size: 1, hp: 1 },
};

export const shipsDefaultStateArr = Object.keys(shipsDefaultState).map(
  (key) => {
    return { ...shipsDefaultState[key as ShipID] };
  },
);

export type ShipID = keyof typeof shipsDefaultState;
export type Cell = {
  row: number;
  col: number;
  id: string;
  shipId: ShipID;
  hit?: boolean;
};
export type Board = Cell[][];

function getShipOrientation(
  board: Board,
  row: number,
  col: number,
  shipId: ShipID,
): string {
  const ship = shipsDefaultState[shipId];

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
  shipId: ShipID,
) {
  const ship = shipsDefaultState[shipId];
  const orientation = getShipOrientation(board, row, col, shipId);

  if (orientation === 'horizontal') {
    // check ship position
    if (row < 0 || row >= rows) return false;
    if (col < 0 || col + ship.size - 1 >= columns) return false;

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
    if (row < 0 || row + ship.size - 1 >= rows) return false;
    if (col < 0 || col >= columns) return false;

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

export const sunkShip = (board: Board, shipId: ShipID) => {
  const ship = { ...shipsDefaultState[shipId] };
  let orientation: string;
  let firstCell: Cell | undefined;

  for (const row of board) {
    for (const cell of row) {
      if (cell.shipId === ship.id) {
        firstCell = cell;
        break;
      }
    }

    if (firstCell) {
      break;
    }
  }

  if (!firstCell) {
    return;
  }

  if (
    board[firstCell.row][firstCell.col + 1] &&
    board[firstCell.row][firstCell.col + 1].shipId === ship.id
  ) {
    orientation = 'horizontal';
  } else {
    orientation = 'vertical';
  }

  if (orientation === 'horizontal') {
    const firstColumn = firstCell.col - 1;
    const lastColumn = firstCell.col + ship.size;

    const firstRow = firstCell.row - 1;
    const lastRow = firstCell.row + 1;

    for (let col = firstColumn; col < lastColumn + 1; col++) {
      for (let row = firstRow; row < lastRow + 1; row++) {
        if (board[row] && board[row][col]) {
          board[row][col].hit = true;
        }
      }
    }
  } else if (orientation === 'vertical') {
    const firstRow = firstCell.row - 1;
    const lastRow = firstCell.row + ship.size;

    const firstColumn = firstCell.col - 1;
    const lastColumn = firstCell.col + 1;

    for (let row = firstRow; row < lastRow + 1; row++) {
      for (let col = firstColumn; col < lastColumn + 1; col++) {
        if (board[row] && board[row][col]) {
          board[row][col].hit = true;
        }
      }
    }
  }
};
