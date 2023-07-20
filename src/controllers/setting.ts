import Player from '../models/Player';
import { ExtendedSocket } from '../socket/router';
import { getErrorMessage } from '../utils/errors';
import { SettingResponse } from '../utils/responses';
import {
  Board,
  columns,
  rows,
  shipsDefaultState,
  validateShipPosition,
} from '../utils/settingUtils';

export const applySetting = async function (
  this: ExtendedSocket,
  board: Board,
) {
  try {
    const player = await Player.findById(this.playerId);
    if (!player) {
      throw new Error('User connection fault.');
    }

    if (!board[rows - 1] || !board[rows - 1][columns - 1]) {
      throw new Error('User passed invalid setting (invalid board size).');
    }

    const foundShips: { [x: string]: boolean } = {};
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const { shipId } = board[row][col];

        if (shipsDefaultState[shipId] && foundShips[shipId] === undefined) {
          foundShips[shipId] = validateShipPosition(board, row, col, shipId);
        }
      }
    }

    const settingValid = Object.keys(shipsDefaultState).reduce((acc, cur) => {
      if (!acc || !foundShips[cur]) return false;
      return true;
    }, true);
    if (!settingValid) {
      throw new Error('User passed invalid setting (ships placement).');
    }

    const validatedBoard = board.map((row) => {
      return row.map((col) => ({ ...col, hit: false }));
    });
    await player.setDefaults(validatedBoard);

    const response: SettingResponse = {
      message: `Congratulations ${player.name}, your setting is right!`,
      validatedBoard,
    };

    this.emit('apply-setting', response);
  } catch (err) {
    console.error(err);
    this._error({ message: getErrorMessage(err) || 'Apply setting error.' });
  }
};
