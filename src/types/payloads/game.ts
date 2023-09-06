export enum GameStatus {
  INACTIVE = 'INACTIVE',
  USER_TURN = 'USER_TURN',
  RIVAL_TURN = 'RIVAL_TURN',
  WIN = 'WIN',
  LOSE = 'LOSE',
}

export type Hit = { row: number; col: number; shipHit?: boolean };

export type GameUpdatePayload = {
  gameStatus?: GameStatus;
  hitsDealt?: Hit[];
  hitsReceived?: Hit[];
};

export type GameHitPayload = {
  row: number;
  col: number;
};
