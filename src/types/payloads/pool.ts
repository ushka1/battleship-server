import { Ship } from 'models/Ship';

/**
 * Request payload.
 */
export type JoinPoolPayload = {
  ships: Ship[];
};
