/**
 * Response payload.
 */
export type UserUpdatePayload = {
  userStatus?: UserStatus;
  userId?: string;
  username?: string;
};

export enum UserStatus {
  IDLE = 'IDLE',
  POOL = 'POOL',
  ROOM = 'ROOM',
  GAME = 'GAME',
}
