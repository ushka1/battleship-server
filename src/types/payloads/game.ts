export enum GameStatus {
  INACTIVE = 'INACTIVE',
  USER_TURN = 'USER_TURN',
  RIVAL_TURN = 'RIVAL_TURN',
  WIN = 'WIN',
  LOSE = 'LOSE',
}

export type GameUpdatePayload = {
  gameStatus?: GameStatus;
  userShots?: { row: number; col: number; shipHit?: boolean }[];
  rivalShots?: { row: number; col: number; shipHit?: boolean }[];
};

export type GameShotPayload = {
  row: number;
  col: number;
};
