import Player from '../models/Player';
import { ExtSocket } from '../routes/index';
import { SettingResponse } from '../utils/responses';
import {
  Board,
  columns,
  rows,
  shipDefaults,
  shipProperlySettled,
} from '../utils/settingUtils';
import { getErrorMessage } from '../utils/utils';

export const applySetting = async function (this: ExtSocket, board: Board) {
  try {
    const player = await Player.findById(this.playerId).exec();

    if (!player) {
      throw new Error('User connection fault.');
    }

    if (!board[rows - 1] || !board[rows - 1][columns - 1]) {
      throw new Error('User passed invalid setting.');
    }

    const foundShips: { [x: string]: any } = {};

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const { shipId } = board[row][col];

        if (shipDefaults[shipId] && foundShips[shipId] === undefined) {
          foundShips[shipId] = shipProperlySettled(board, row, col, shipId);
        }
      }
    }

    const settingValid = Object.keys(shipDefaults).reduce((acc, cur) => {
      if (!acc || !foundShips[cur]) return false;
      return true;
    }, true);

    if (!settingValid) {
      throw new Error('User passed invalid setting.');
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
    console.error('Error in "controllers/setting.ts [applySetting]".');
    this._error({ message: getErrorMessage(err) || 'Setting Error.' });
  }
};
