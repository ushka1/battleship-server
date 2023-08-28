import { Mutex } from 'async-mutex';
import { IUser } from 'models/User';
import { addUsersToRoom } from './roomService';

type PoolTicket = {
  userId: string;
  eloScore: number;
  createdAt: Date;
};

let pool: PoolTicket[] = [];
let timer: NodeJS.Timeout | null = null;
const mutex = new Mutex();
const matchTimeout = 1000;

export function addUserToPoolValidator(user: IUser | null): string | void {
  if (!user) {
    return 'User not found.';
  }

  if (!user.isOnline) {
    return 'User not online.';
  }

  if (user.inRoom) {
    return 'User already in room.';
  }

  if (isUserInPool(user)) {
    return 'User already in pool.';
  }
}

/**
 * Add user to the pool.
 */
export async function addUserToPool(user: IUser) {
  const release = await mutex.acquire();

  pool.push({
    userId: user.id,
    eloScore: 0,
    createdAt: new Date(),
  });

  release();
}

export function removeUserFromPoolValidator(user: IUser | null): string | void {
  if (!user) {
    return 'User not found.';
  }

  if (!isUserInPool(user)) {
    return 'User not in pool.';
  }
}

/**
 * Remove user from the pool.
 */
export async function removeUserFromPool(user: IUser) {
  const release = await mutex.acquire();

  pool = pool.filter((ticket) => ticket.userId !== user.id);

  release();
}

/**
 * Check if user is in the pool.
 */
function isUserInPool(user: IUser): boolean {
  return !!pool.find((ticket) => ticket.userId === user.id);
}

/* ============================================================ */

/**
 * Initialize the pool service.
 */
export function initPoolService() {
  restartService();
}

/**
 * Restart the matching service.
 */
function restartService() {
  if (timer) {
    clearInterval(timer);
  }

  timer = setInterval(matchUsers, matchTimeout);
}

/**
 * Sort the pool by elo score.
 */
function sortPool() {
  pool.sort((a, b) => a.eloScore - b.eloScore);
}

/**
 * Match users in the pool.
 */
async function matchUsers() {
  const release = await mutex.acquire();

  sortPool();

  while (pool.length >= 2) {
    const [user1, user2] = pool.splice(0, 2);
    addUsersToRoom(user1.userId, user2.userId);
  }

  release();
}
