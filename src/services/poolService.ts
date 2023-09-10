import { Mutex } from 'async-mutex';

import { UserDocument } from 'models/User';
import { createNewRoom } from 'services/roomService';

/* ========================= MATCHMAKING ========================= */

type PoolEntry = {
  userId: string;
  eloScore: number;
  createdAt: Date;
};

let pool: PoolEntry[] = [];
let timer: NodeJS.Timeout | null = null;
const mutex = new Mutex();
const matchTimeout = 1000;

/**
 * Initialize the pool service.
 */
export function initPoolService() {
  restartPoolService();
}

/**
 * Restart the matching service.
 */
function restartPoolService() {
  if (timer) {
    clearInterval(timer);
  }

  timer = setInterval(() => {
    matchUsers();
  }, matchTimeout);
}

/**
 * Sort the pool by elo score.
 */
function sortPool() {
  pool.sort((a, b) => a.eloScore - b.eloScore);
}

/**
 * Match users in the pool.
 * Synchronized on pool.
 */
async function matchUsers() {
  const release = await mutex.acquire();

  try {
    sortPool();

    while (pool.length >= 2) {
      const [entry1, entry2] = pool.splice(0, 2);
      createNewRoom(entry1.userId, entry2.userId);
    }
  } finally {
    release();
  }
}

/* ========================= JOIN/LEAVE ========================= */

/**
 * Add user to the pool.
 * Synchronized on pool.
 */
export async function addUserToPool(user: UserDocument) {
  const release = await mutex.acquire();

  try {
    pool.push({
      userId: user.id,
      eloScore: 0,
      createdAt: new Date(),
    });

    user.poolId = 'classic';
    await user.save();
  } finally {
    release();
  }
}

export function addUserToPoolValidator(user: UserDocument): string | void {
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
 * Remove user from the pool.
 * Synchronized on pool.
 */
export async function removeUserFromPool(user: UserDocument) {
  const release = await mutex.acquire();

  try {
    pool = pool.filter((entry) => entry.userId !== user.id);

    user.poolId = undefined;
    await user.save();
  } finally {
    release();
  }
}

export function removeUserFromPoolValidator(user: UserDocument): string | void {
  if (!isUserInPool(user)) {
    return 'User not in pool.';
  }
}

/**
 * Check if user is in the pool.
 */
function isUserInPool(user: UserDocument): boolean {
  return !!pool.find((entry) => entry.userId === user.id);
}
