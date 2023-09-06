import { Board } from 'models/Board';
import { GameDocument, GameModel } from 'models/Game';
import { RoomDocument } from 'models/Room';
import { Ship } from 'models/Ship';
import { UserDocument, UserModel } from 'models/User';
import {
  GameHitPayload,
  GameStatus,
  GameUpdatePayload,
  Hit,
} from 'types/payloads/game';
import { SocketProvider } from 'utils/socketProvider';

/* ========================= EXISTING GAME ========================= */

export function handleUserHit(
  payload: GameHitPayload,
  game: GameDocument,
  rival: UserDocument,
): Hit[] {
  const hits: Hit[] = [];

  const rivalGameData = game.data.find((data) => data.user === rival.id)!;
  const rivalBoard = rivalGameData.board!;
  const rivalShips = rivalGameData.ships!;

  const { col, row } = payload;
  const cell = rivalBoard.matrix[row][col];

  if (cell.hit) {
    throw new Error('Cell already hit');
  }

  if (cell.shipId) {
    const ship = rivalShips.find((ship) => ship.id === cell.shipId)!;
    ship.hp!--;

    if (ship.hp === 0) {
      hits.push(...sinkShip(ship, rivalBoard));
    } else {
      hits.push({ row, col, shipHit: true });
    }
  } else {
    hits.push({ row, col });
  }

  return hits;
}

function sinkShip(ship: Ship, board: Board): Hit[] {
  const hits: Hit[] = [];

  const startRow = Math.max(ship.row - 1, 0);
  const startCol = Math.max(ship.col - 1, 0);
  let endRow: number;
  let endCol: number;

  if (ship.orientation === 'h') {
    endRow = Math.min(ship.row + 1, 9);
    endCol = Math.min(ship.col + ship.size, 9);
  } else {
    endRow = Math.min(ship.row + ship.size, 9);
    endCol = Math.min(ship.col + 1, 9);
  }

  for (let i = startRow; i <= endRow; i++) {
    for (let j = startCol; j <= endCol; j++) {
      const cell = board.matrix[i][j];

      if (!cell.hit) {
        hits.push({ row: i, col: j, shipHit: !!cell.shipId });
        cell.hit = true;
      }
    }
  }

  return hits;
}

export function updateGameStatus(
  game: GameDocument,
  user: UserDocument,
  rival: UserDocument,
) {
  if (countAliveShips(game, rival) === 0) {
    game.winner = user.id;
  }
}

function countAliveShips(game: GameDocument, user: UserDocument) {
  const userData = game.data.find((data) => data.user === user.id)!;
  const ships = userData.ships!;

  let count = 0;

  ships.forEach((ship) => {
    if (ship.hp) {
      count++;
    }
  });

  return count;
}

export function switchTurns(game: GameDocument) {
  game.turn = (game.turn + 1) % 2;
}

export async function saveGame(game: GameDocument) {
  await game.save();
}

/* ========================= NEW GAME ========================= */

export async function startNewGame(room: RoomDocument) {
  const user1 = (await UserModel.findById(room.users[0]).exec())!;
  const user2 = (await UserModel.findById(room.users[1]).exec())!;
  const game = await createGame(user1, user2);

  room.gameId = game.id;
  await room.save();

  const socket1 = SocketProvider.getSocket(user1.socketId!);
  const socket2 = SocketProvider.getSocket(user2.socketId!);

  const payload1: GameUpdatePayload = {
    gameStatus: game.turn === 0 ? GameStatus.USER_TURN : GameStatus.RIVAL_TURN,
  };
  const payload2: GameUpdatePayload = {
    gameStatus: game.turn === 1 ? GameStatus.USER_TURN : GameStatus.RIVAL_TURN,
  };

  socket1?.emit('game-update', payload1);
  socket2?.emit('game-update', payload2);
}

async function createGame(
  user1: UserDocument,
  user2: UserDocument,
): Promise<GameDocument> {
  return await GameModel.create({
    data: [
      {
        user: user1.id,
        ships: user1.shipsSetting!,
        board: createBoard(user1.shipsSetting!),
      },
      {
        user: user2.id,
        ships: user2.shipsSetting!,
        board: createBoard(user2.shipsSetting!),
      },
    ],
    turn: Math.round(Math.random()),
  });
}

function createBoard(shipsSetting: Ship[]): Partial<Board> {
  const matrix: Board['matrix'] = new Array(10).fill(null).map(() =>
    new Array(10).fill({
      shipId: null,
      hit: false,
    }),
  );

  shipsSetting.forEach((ship) => {
    const { row, col, size, orientation } = ship;

    for (let i = 0; i < size; i++) {
      if (orientation === 'h') {
        matrix[row][col + i].shipId = ship.id;
      } else {
        matrix[row + i][col].shipId = ship.id;
      }
    }
  });

  return { matrix };
}
