import { Schema } from 'mongoose';

import { defaultFleet, sinkShip } from '../../services/settings/helpers';
import { Board } from '../../services/settings/types';
import { IPlayer, IPlayerMethods, PlayerModel } from './Player';

export function setupPlayerMethods(
  schema: Schema<IPlayer, PlayerModel, IPlayerMethods>,
) {
  schema.method('setDefaults', async function (this: IPlayer, board: Board) {
    this.boardDefault = board;
    await this.save();
  });

  schema.method('setNewGame', async function (this: IPlayer) {
    if (!this.boardDefault) throw new Error('Default board is not set.');

    this.board = this.boardDefault;
    this.ships = Object.values(defaultFleet);
    await this.save();
  });

  schema.method('resetGame', async function (this: IPlayer) {
    await this.updateOne([
      { $unset: ['ships', 'board', 'boardDefault', 'room', 'turnId'] },
    ]).exec();
  });

  schema.method(
    'handleHit',
    async function (this: IPlayer, row: number, col: number) {
      if (!this.board) {
        throw new Error('An unexpected error occurred.');
      }

      if (this.board[row][col].hit) {
        return true;
      }

      let shipHitted = false;
      const shipId = this.board[row][col].shipId;

      if (shipId && this.ships) {
        const ship = this.ships.find((ship) => ship.id === shipId)!;
        ship.hp--;

        if (ship.hp <= 0) {
          sinkShip(this.board, shipId);
        }

        shipHitted = true;
      }

      this.board[row][col].hit = true;
      await this.save();

      return shipHitted;
    },
  );

  schema.method('hasShips', function (this: IPlayer) {
    const allShipsSunked = this.ships!.reduce((acc, cur) => {
      if (acc && cur.hp <= 0) {
        return true;
      } else {
        return false;
      }
    }, true);

    return !allShipsSunked;
  });
}
