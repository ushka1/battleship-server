import Player from '../models/Player';
import { SettingResponse } from '../utils/responses';
import {
  shipProperlySettled,
  Board,
  shipsDefault,
  rowsLength,
  colsLength,
} from '../utils/settingUtils';
import { ExtSocket } from '../routes/index';

export const applySetting = async function (this: ExtSocket, board: Board) {
  try {
    const player = await Player.findById(this.playerId);

    if (!player) {
      throw new Error('User connection fault.');
    }

    if (!board[rowsLength - 1] || !board[rowsLength - 1][colsLength - 1]) {
      throw new Error('User passed invalid setting.');
    }

    const foundShips: { [x: string]: any } = {};

    for (let row = 0; row < rowsLength; row++) {
      for (let col = 0; col < colsLength; col++) {
        const { shipId } = board[row][col];

        if (shipsDefault[shipId] && foundShips[shipId] === undefined) {
          foundShips[shipId] = shipProperlySettled(board, row, col, shipId);
        }
      }
    }

    const settingValid = Object.keys(shipsDefault).reduce((acc, cur) => {
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
    this.error({ message: err.message || 'Setting Error.' });
  }
};
