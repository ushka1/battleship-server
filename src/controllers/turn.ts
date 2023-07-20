import Player from '../models/Player';
import Room from '../models/Room';
import { ExtSocket } from '../routes/index';
import { TurnResponse } from '../utils/responses';
import { SocketManager } from '../utils/SocketManager';

export const setTurnIds = async (roomId: string) => {
  const room = await Room.findById(roomId).populate('players').exec();
  if (!room) {
    return;
  }

  let turnId = 1;
  for await (const player of room.players) {
    player.turnId = turnId;
    await player.save();

    turnId++;
  }

  const firstTurn = Math.round(Math.random()) + 1;
  room.turn = firstTurn;
  await room.save();
};

export const getTurnId = async function (this: ExtSocket) {
  const player = await Player.findById(this.playerId).exec();
  const room = await Room.findById(this.roomId).exec();

  if (player && room) {
    this.turnId = player.turnId;

    const response: TurnResponse = {
      message: `Congratulations ${player.name}, your turnId is ${player.turnId}!`,
      turnId: player.turnId,
      turn: room.turn,
    };

    this.emit('turn-controller', response);
  } else {
    this._error('An unexpected error occurred.');
  }
};

export const changeTurn = async (roomId: string) => {
  const { io } = SocketManager.getInstance();
  if (!io) {
    throw new Error('Socket Error.');
  }

  const room = await Room.findById(roomId).exec();
  if (!room) {
    throw new Error('An unexpected error occurred.');
  }

  await room.changeTurn();
  io.to(roomId).emit('turn-controller', {
    message: 'Congratulations to both players, the turn has changed!',
    turn: room.turn,
  });
};
