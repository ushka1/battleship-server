import { IPlayer } from '../models/Player';

export type ConnectResponse = {
  message?: string;
  player?: any;
};

export type DisconnectResponse = {
  message?: string;
  playerLeft?: boolean;
  board?: IPlayer['boardDefault'];
};

export type SettingResponse = {
  message?: string;
  validatedBoard?: any;
};

export type MatchmakingResponse = {
  message?: string;
  readyToPlay?: boolean;
  playerLeft?: boolean;
  board?: IPlayer['boardDefault'];
};

export type TurnResponse = {
  message?: string;
  turnId?: number;
  turn?: number;
};
