import express from 'express';
import { connect } from 'mongoose';
import socketio from 'socket.io';

import { init } from './utils/socket';
import startConnection from './controllers';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

(async () => {
  await connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@deck.rbvm5.mongodb.net/${process.env.DB_NAME}`,
    { useNewUrlParser: true, useUnifiedTopology: true },
  );
  const server = app.listen(process.env.PORT || 5000);

  const io = socketio.listen(server, { origins: ['http://localhost:3000'] });

  if (io) {
    init(io);
    io.on('connect', startConnection);
  }
})();
