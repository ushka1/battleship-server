export type Ship = {
  id: string;
  size: number;
  hp: number;
};

export type ShipKey =
  | 'ship-0'
  | 'ship-1'
  | 'ship-2'
  | 'ship-3'
  | 'ship-4'
  | 'ship-5'
  | 'ship-6'
  | 'ship-7'
  | 'ship-8'
  | 'ship-9';

export type BoardCell = {
  row: number;
  col: number;
  id: string;
  shipId: ShipKey;
  hit?: boolean;
};

export type Board = BoardCell[][];
