import { Game } from 'models/Game';
import { Room } from 'models/Room';
import { IShip } from 'models/Ship';
import { IUser, User } from 'models/User';

export async function startGame(roomId: string) {
  const room = (await Room.findById(roomId).exec())!;
  if (!room || room.users.length !== 2) {
    // handle this case
    return;
  }

  // populate instead
  const user1 = (await User.findById(room.users[0]).exec())!;
  const user2 = (await User.findById(room.users[1]).exec())!;

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

function startGameUserValidator(user: IUser | null): string | void {
  if (!user) {
    return 'User not found.';
  }

  if (!user.isOnline) {
    return 'User not online.';
  }
}

function createBoard(ships: IShip[]) {
  const gameBoard = new Array(10).fill(null).map(() =>
    new Array(10).fill({
      shipId: null,
      hit: false,
    }),
  );

  const displayBoard = new Array(10)
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

async function createGame(user1: IUser, user2: IUser) {
  const ships1 = user1.currentSetting!;
  const ships2 = user2.currentSetting!;

  const board1 = createBoard(ships1);
  const board2 = createBoard(ships2);

  await Game.create({
    data: [
      {
        userId: user1._id,
        board: board1,
        ships: ships1,
      },
      {
        userId: user2._id,
        board: board2,
        ships: ships2,
      },
    ],
  });
}
