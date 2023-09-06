import { Board } from 'models/Board';
import { GameDocument, GameModel } from 'models/Game';
import { RoomModel } from 'models/Room';
import { Ship } from 'models/Ship';
import { UserDocument, UserModel } from 'models/User';

export async function startGame(roomId: string) {
  const room = (await RoomModel.findById(roomId).exec())!;
  if (!room || room.users.length !== 2) {
    // handle this case
    return;
  }

  // populate instead
  const user1 = (await UserModel.findById(room.users[0]).exec())!;
  const user2 = (await UserModel.findById(room.users[1]).exec())!;

  const userError1 = startGameUserValidator(user1);
  const userError2 = startGameUserValidator(user2);

  // TODO: better handling
  if (userError1 && userError2) {
    return;
  } else if (userError1) {
    // handle this case
    return;
  } else if (userError2) {
    // handle this case
    return;
  }

  await createGame(user1, user2);
}

function startGameUserValidator(user: UserDocument | null): string | void {
  if (!user) {
    return 'User not found.';
  }

  if (!user.isOnline) {
    return 'User not online.';
  }
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

async function createGame(
  user1: UserDocument,
  user2: UserDocument,
): Promise<GameDocument> {
  const ships1 = user1.currentSetting;
  const ships2 = user2.currentSetting;

  if (!ships1 || !ships2) {
    // handle this case
    throw new Error('User ships not found.');
  }

  const board1 = createBoard(ships1);
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
