import express from 'express';
import socketio from 'socket.io';
import cors from 'cors';
import { connect } from 'mongoose';

import { Socket } from './utils/Socket';
import router from './routes';

const app = express();
app.use(
  cors({ origin: ['https://batiuszkamaroz.github.io/BATTLESHIP_CLIENT/'] }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

(async () => {
  await connect(`${process.env.DB_CONNECT}/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    auth: {
      password: `${process.env.DB_PASSWORD}`,
      user: `${process.env.DB_USERNAME}`,
    },
    dbName: `${process.env.DB_NAME}`,
  });

  const server = app.listen(process.env.PORT || 5000);
  const io = socketio.listen(server, { origins: [process.env.SOCKET_ORIGIN] });

  if (io) {
    Socket.init(io);
    io.on('connect', router);
  }
})();
