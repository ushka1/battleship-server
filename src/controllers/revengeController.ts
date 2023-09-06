import { RoomModel } from 'models/Room';
import { UserModel } from 'models/User';
import { SocketController } from 'router/middleware';
import { getOrSetMutex, unsetMutex } from 'services/mutexService';

export const revengeWillController: SocketController = async function ({
  socket,
}) {
  const user = await UserModel.findById(socket.userId).orFail().exec();

  const mutex = getOrSetMutex(user.roomId!);
  const release = await mutex.acquire();

  const room = await RoomModel.findById(user.roomId!).orFail().exec();
  room.markRevengeWill(user);
  await room.save();

  release();

  if (room.revenge!.willing.length === 2) {
    // do stuff...

    unsetMutex(user.roomId!);
  }
};

export const revengeReadyController: SocketController = async function ({
  socket,
}) {
  const user = await UserModel.findById(socket.userId).orFail().exec();

  const mutex = getOrSetMutex(user.roomId!);
  const release = await mutex.acquire();

  // update setting

  const room = await RoomModel.findById(user.roomId!).orFail().exec();
  room.markRevengeReady(user);
  await room.save();

  release();

  if (room.revenge!.ready.length === 2) {
    // start game

    unsetMutex(user.roomId!);
  }
};
