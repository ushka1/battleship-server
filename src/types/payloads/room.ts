/**
 * Response payload.
 */
export type RoomUpdatePayload = {
  roomStatus?: RoomStatus;
  rivalData?: RivalData;
  chat?: RoomChatMessage[];
};

export enum RoomStatus {
  PLAYING = 'PLAYING',
  PLAYER_LEFT = 'PLAYER_LEFT',
  FINISHED = 'FINISHED',
}

export type RivalData = {
  username: string;
};

export type RoomChatMessage = {
  username: string;
  content: string;
};
