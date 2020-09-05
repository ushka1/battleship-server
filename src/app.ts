import express from 'express';
import { connect } from 'mongoose';
import socketio from 'socket.io';

import { init } from './utils/socket';
import startConnection from './controllers';

const app = express();

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

  const io = socketio.listen(server, { origins: ['http://localhost:3000'] });

  if (io) {
    init(io);
    io.on('connect', startConnection);
  }
})();
