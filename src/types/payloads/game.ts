/**
 * Request payload.
 */
export type GameHitPayload = {
  row: number;
  col: number;
};

/**
 * Response payload.
 */
export type GameUpdatePayload = {
  gameStatus?: GameStatus;
  hitsDealt?: Hit[];
  hitsReceived?: Hit[];
  // TODO: Add fields for ships.
};

export enum GameStatus {
  INACTIVE = 'INACTIVE',
  USER_TURN = 'USER_TURN',
  RIVAL_TURN = 'RIVAL_TURN',
  WIN = 'WIN',
  LOSE = 'LOSE',
}

export type Hit = { row: number; col: number; shipHit?: boolean };
