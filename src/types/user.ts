export enum UserState {
  IDLE = 'IDLE',
  POOL = 'POOL',
  ROOM = 'ROOM',
  GAME = 'GAME',
}

export type UserUpdatePayload = {
  userState?: UserState;

  userId?: string;
  username?: string;
};
