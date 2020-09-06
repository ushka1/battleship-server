import { IPlayer } from '../models/Player';
import Room from '../models/Room';
import { getIO } from '../utils/socket';

export const setTurnIds = async (roomId: string) => {
  const io = getIO()!;
  const room = await Room.findById(roomId);

  if (!room) {
    io.in(roomId).emit('turn-controller', {
      message: 'An unexpected error occurred.',
      error: 1,
    });
    return;
  }

  await room.populate('players').execPopulate();
  room.players.forEach(async (player: IPlayer, idx) => {
    player.turn = idx + 1;
    await player.save();
    io.to(player.socketId).emit('turn-controller', {
      message: `Congratulations ${player.name}, your turnId is: ${idx + 1}!`,
      turnId: idx + 1,
    });
  });
};
