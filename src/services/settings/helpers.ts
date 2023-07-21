import { Board, BoardCell, Ship, ShipKey } from './types';

export const defaultFleet: { [key in ShipKey]: Ship } = Object.freeze({
  'ship-0': Object.freeze({ id: 'ship-0', size: 4, hp: 4 }),
  'ship-1': Object.freeze({ id: 'ship-1', size: 3, hp: 3 }),
  'ship-2': Object.freeze({ id: 'ship-2', size: 3, hp: 3 }),
  'ship-3': Object.freeze({ id: 'ship-3', size: 2, hp: 2 }),
  'ship-4': Object.freeze({ id: 'ship-4', size: 2, hp: 2 }),
  'ship-5': Object.freeze({ id: 'ship-5', size: 2, hp: 2 }),
  'ship-6': Object.freeze({ id: 'ship-6', size: 1, hp: 1 }),
  'ship-7': Object.freeze({ id: 'ship-7', size: 1, hp: 1 }),
  'ship-8': Object.freeze({ id: 'ship-8', size: 1, hp: 1 }),
  'ship-9': Object.freeze({ id: 'ship-9', size: 1, hp: 1 }),
});

export function sinkShip(board: Board, shipId: ShipKey) {
  const ship = defaultFleet[shipId];

  let orientation: string;
  let firstCell: BoardCell | undefined;

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
}
