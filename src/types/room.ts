export enum RoomState {
  INACTIVE = 'INACTIVE',
  MATCHMAKING = 'MATCHMAKING',
  READY = 'READY',
  UNREADY = 'UNREADY',
  PLAYING = 'PLAYING',
}

export type RivalData = {
  username: string;
};

export type ChatMessage = {
  username: string;
  content: string;
};

export type RoomUpdatePayload = {
  roomState?: RoomState;
  rivalData?: RivalData;
  chat?: ChatMessage[];
};
