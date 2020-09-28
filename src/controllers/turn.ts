import Room from '../models/Room';
import { ExtSocket } from './index';
import { getIO } from '../utils/socket';

export const setTurnIds = async (roomId: string) => {
  const io = getIO();
  if (!io) {
    throw new Error('Socket Error.');
  }

  const room = await Room.findById(roomId);
  if (!room) {
    io.in(roomId).emit('turn-controller', {
      message: 'An unexpected error occurred.',
      error: 1,
    });

    return;
  }
  await room.populate('players').execPopulate();

  let turnId = 1;
  for await (const player of room.players) {
    player.turnId = turnId;
    await player.save();

    const socket: ExtSocket = io.sockets.connected[player.socketId];
    socket.turnId = turnId;

    io.to(player.socketId).emit('turn-controller', {
      message: `Congratulations ${player.name}, your turnId is: ${turnId}!`,
      turnId,
    });

    turnId++;
  }

  const firstTurn = Math.round(Math.random() + 1);
  room.turn = firstTurn;
  await room.save();

  io.to(roomId).emit('turn-controller', {
    message: `Congratulations to both players, player with turnId: ${firstTurn} starts a game!`,
    turn: firstTurn,
  });
};

export const changeTurn = async (roomId: string) => {
  const io = getIO();
  if (!io) {
    throw new Error('Socket Error.');
  }

  const room = await Room.findById(roomId);
  if (!room) {
    throw new Error('An unexpected error occurred.');
  }

  await room.changeTurn();
  io.to(roomId).emit('turn-controller', {
    message: 'Congratulations to both players, the turn has changed!',
    turn: room.turn,
  });
};
