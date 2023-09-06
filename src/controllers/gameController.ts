import { GameModel } from 'models/Game';
import { RoomModel } from 'models/Room';
import { UserModel } from 'models/User';
import { SocketController } from 'router/middleware';
import {
  handleUserHit,
  saveGame,
  switchTurns,
  updateGameStatus,
} from 'services/gameService';
import {
  GameHitPayload,
  GameStatus,
  GameUpdatePayload,
} from 'types/payloads/game';
import { SocketProvider } from 'utils/socketProvider';

export const gameHitController: SocketController<GameHitPayload> =
  async function ({ payload, socket }) {
    // validate payload

    const user = await UserModel.findById(socket.userId).orFail().exec();
    const room = await RoomModel.findById(user.roomId).orFail().exec();
    const game = await GameModel.findById(room.gameId).orFail().exec();
    const rival = await UserModel.findById(room.getRival(user)).orFail().exec();

    // check turn
    // check if game is finished

    const hits = handleUserHit(payload!, game, rival);

    updateGameStatus(game, user, rival);
    switchTurns(game);
    await saveGame(game);

    const gameFinished = !!game.winner;

    const userSocket = SocketProvider.getSocket(user.socketId!);
    const rivalSocket = SocketProvider.getSocket(rival.socketId!);

    const userPayload: GameUpdatePayload = {
      gameStatus: gameFinished ? GameStatus.WIN : GameStatus.RIVAL_TURN,
      hitsDealt: hits,
    };
    const rivalPayload: GameUpdatePayload = {
      gameStatus: gameFinished ? GameStatus.LOSE : GameStatus.USER_TURN,
      hitsReceived: hits,
    };

    userSocket?.emit('game-update', userPayload);
    rivalSocket?.emit('game-update', rivalPayload);
  };
