export type Ship = {
  readonly id: string;
  readonly size: number;
  row: number;
  col: number;
  orientation: 'h' | 'v';
};
