import { Ship } from 'models/Ship';

export type RevengeReadyPayload = {
  shipsSetting: Ship[];
};

export type RevengeUpdatePayload = {
  ready?: string[];
  willing?: string[];
};
