import { RoomModel } from 'models/Room';
import { UserModel } from 'models/User';
import { SocketController } from 'router/middleware';
import { startNewGame } from 'services/gameService';
import { getOrSetMutex, unsetMutex } from 'services/mutexService';
import { validateShipsSetting } from 'services/shipsSettingService';
import { RevengeReadyPayload } from 'types/payloads/revenge';

/**
 * Synchronized on room.
 */
export const revengeWillController: SocketController = async function ({
  socket,
}) {
  const user = await UserModel.findById(socket.userId).orFail().exec();
  const room = await RoomModel.findById(user.roomId!).orFail().exec();

  const mutex = getOrSetMutex(user.roomId!);
  const release = await mutex.acquire();

  try {
    room.setUserRevengeWill(user, true);
    await room.save();

    if (room.getRevengeWillingCount() === 2) {
      // send update...
      unsetMutex(user.roomId!);
    } else {
      // send update...
    }
  } finally {
    release();
  }
};

/**
 * Synchronized on room.
 */
export const revengeReadyController: SocketController<RevengeReadyPayload> =
  async function ({ socket, payload }) {
    const shipsValid = validateShipsSetting(payload!.shipsSetting);
    if (!shipsValid) {
      // send error...
      return;
    }

    const user = await UserModel.findById(socket.userId).orFail().exec();
    const room = await RoomModel.findById(user.roomId!).orFail().exec();

    const mutex = getOrSetMutex(user.roomId!);
    const release = await mutex.acquire();

    try {
      user.shipsSetting = payload!.shipsSetting;
      await user.save();

      room.setUserRevengeReady(user, true);
      await room.save();

      if (room.getRevengeReadyCount() === 2) {
        // send update...
        unsetMutex(user.roomId!);
        startNewGame(room); // for sure?
      } else {
        // send update...
      }
    } finally {
      release();
    }
    // update setting
  };
