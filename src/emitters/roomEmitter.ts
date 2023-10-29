import { ExtendedSocket } from 'router/middleware';
import { SocketProvider } from 'utils/socketProvider';

type RoomJoinPayload = {
  rival: {
    username: string;
  };
};

export function emitRoomJoin(socket: ExtendedSocket, payload: RoomJoinPayload) {
  socket.emit('room/join', payload);
}

export function emitRoomLeave(socket: ExtendedSocket) {
  socket.emit('room/leave');
}

type PlayerLeftPayload = {
  player: {
    username: string;
  };
};

export function emitRoomPlayerLeft(roomId: string, payload: PlayerLeftPayload) {
  SocketProvider.getIO().to(roomId).emit('room/player-left', payload);
}

type PlayerDisconnectedPayload = {
  player: {
    username: string;
  };
};

export function emitRoomPlayerDisconnected(
  roomId: string,
  payload: PlayerDisconnectedPayload,
) {
  SocketProvider.getIO().to(roomId).emit('room/player-disconnected', payload);
}

type PlayerReconnectedPayload = {
  player: {
    username: string;
  };
};

export function emitRoomPlayerReconnected(
  roomId: string,
  payload: PlayerReconnectedPayload,
) {
  SocketProvider.getIO().to(roomId).emit('room/player-reconnected', payload);
}

type ChatUpdatePayload = {
  player: {
    username: string;
  };
  content: string;
};

export function emitRoomChatMessage(
  roomId: string,
  payload: ChatUpdatePayload,
) {
  SocketProvider.getIO().to(roomId).emit('room/chat-message', payload);
}
