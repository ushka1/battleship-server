import { Ship } from 'models/Ship';

/**
 * Request payload.
 */
export type RevengeReadyPayload = {
  shipsSetting: Ship[];
};

/**
 * Response payload.
 */
export type RevengeUpdatePayload = {
  revengeWillingUsers?: string[];
  revengeReadyUsers?: string[];
};
