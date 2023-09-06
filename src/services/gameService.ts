import { Board } from 'models/Board';
import { GameDocument, GameModel } from 'models/Game';
import { RoomDocument } from 'models/Room';
import { Ship } from 'models/Ship';
import { UserDocument, UserModel } from 'models/User';
import { GameStatus, GameUpdatePayload } from 'types/payloads/game';
import { SocketProvider } from 'utils/socketProvider';

export async function startNewGame(room: RoomDocument) {
  if (room.users.length !== 2) {
    // handle this case
    return;
  }

  const user1 = (await UserModel.findById(room.users[0]).exec())!;
  const user2 = (await UserModel.findById(room.users[1]).exec())!;

  const game = await createNewGame(user1, user2);
  changeTurns(user1, user2, game);
}

async function changeTurns(
  user1: UserDocument,
  user2: UserDocument,
  game: GameDocument,
) {
  const io = SocketProvider.getInstance().io;
  const socket1 = io.sockets.sockets.get(user1.socketId!);
  const socket2 = io.sockets.sockets.get(user2.socketId!);

  if (!socket1 || !socket2) {
    return;
  }

  game.turn = (game.turn + 1) % 2;
  await game.save();

  const payload1: GameUpdatePayload = {
    gameStatus: game.turn === 0 ? GameStatus.USER_TURN : GameStatus.RIVAL_TURN,
  };
  const payload2: GameUpdatePayload = {
    gameStatus: game.turn === 1 ? GameStatus.USER_TURN : GameStatus.RIVAL_TURN,
  };

  socket1.emit('game-update', payload1);
  socket2.emit('game-update', payload2);
}

async function createNewGame(
  user1: UserDocument,
  user2: UserDocument,
): Promise<GameDocument> {
  const ships1 = user1.currentSetting!;
  const board1 = createBoard(ships1);

  const ships2 = user2.currentSetting!;
  const board2 = createBoard(ships2);

  return await GameModel.create({
    data: [
      {
        user: user1.id,
        board: board1,
        ships: ships1,
      },
      {
        user: user2.id,
        board: board2,
        ships: ships2,
      },
    ],
    turn: Math.round(Math.random()),
  });
}

function createBoard(ships: Ship[]): Partial<Board> {
  const gameBoard: Board['gameBoard'] = new Array(10).fill(null).map(() =>
    new Array(10).fill({
      shipId: null,
      hit: false,
    }),
  );

  const displayBoard: Board['displayBoard'] = new Array(10)
    .fill(null)
    .map(() => new Array(10).fill(0));

  ships.forEach((ship) => {
    const { row, col, size, orientation } = ship;

    for (let i = 0; i < size; i++) {
      if (orientation === 'h') {
        gameBoard[row][col + i].shipId = ship.id;
      } else {
        gameBoard[row + i][col].shipId = ship.id;
      }
    }
  });

  return { gameBoard, displayBoard };
}
