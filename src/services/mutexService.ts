import { Mutex } from 'async-mutex';

const mutexMap: { [key: string]: Mutex } = {};

export function getOrSetMutex(key: string) {
  if (!mutexMap[key]) {
    mutexMap[key] = new Mutex();
  }

  return mutexMap[key];
}

export function unsetMutex(key: string) {
  if (!mutexMap[key]) {
    return;
  }

  mutexMap[key].cancel();
  delete mutexMap[key];
}
