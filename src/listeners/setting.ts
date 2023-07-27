import { BOARD_COLS, BOARD_ROWS } from '../config/constants';
import { Player } from '../models/player/Player';
import { SocketListener } from '../router/types';
import { defaultFleet } from '../services/settings/helpers';
import { Board } from '../services/settings/types';
import { validateShipPosition } from '../services/settings/validators';
import { SettingResponse } from '../types/responses';
import { getErrorMessage } from '../utils/errors';

export const applySettingListener: SocketListener<{ board: Board }> =
  async function (socket, payload) {
    const { board } = payload;

    try {
      const player = await Player.findById(socket.playerId).exec();
      if (!player) {
        throw new Error('User connection fault.');
      }

      if (!board[BOARD_ROWS - 1] || !board[BOARD_ROWS - 1][BOARD_COLS - 1]) {
        throw new Error('User passed invalid setting (invalid board size).');
      }

      const foundShips: { [x: string]: boolean } = {};
      for (let row = 0; row < BOARD_ROWS; row++) {
        for (let col = 0; col < BOARD_COLS; col++) {
          const { shipId } = board[row][col];

          if (defaultFleet[shipId] && foundShips[shipId] === undefined) {
            foundShips[shipId] = validateShipPosition(board, row, col, shipId);
          }
        }
      }

      const settingValid = Object.keys(defaultFleet).reduce((acc, cur) => {
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
        message: `Congratulations ${player.username}, your setting is right!`,
        validatedBoard,
      };

      socket.emit('apply-setting', response);
    } catch (err) {
      console.error(err);
      socket._error({
        message: getErrorMessage(err) || 'Apply setting error.',
      });
    }
  };
