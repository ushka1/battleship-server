export enum RoomStatus {
  PLAYING = 'PLAYING',
  PLAYER_LEFT = 'PLAYER_LEFT',
  FINISHED = 'FINISHED',
}

export type RivalData = {
  username: string;
};

export type RoomChatPayload = {
  username: string;
  content: string;
};

export type RoomUpdatePayload = {
  roomStatus?: RoomStatus;
  rivalData?: RivalData;
  chat?: RoomChatPayload[];
};
