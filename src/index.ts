import cors from 'cors';
import express from 'express';
import { connect } from 'mongoose';
import { Server as SocketServer } from 'socket.io';

import router from './routes';
import { SocketManager } from './utils/SocketManager';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Server is up.');
});

(async () => {
  try {
    await connect('mongodb://localhost:27017', {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
      dbName: process.env.DB_NAME,
      auth: {
        password: process.env.DB_PASSWORD,
        username: process.env.DB_USERNAME,
      },
      authSource: process.env.DB_AUTH_SOURCE,
    });
    console.log('Connected to MongoDB.');

    const port = process.env.PORT ?? 8080;
    const server = app.listen(port);
    console.log(`Server listening on port ${port}.`);

    const io = new SocketServer({
      cors: { origin: process.env.SOCKET_ORIGIN },
    });
    io.listen(server);
    io.on('connect', router);
    console.log(`Socket listening.`);

    SocketManager.init(io);
    console.log('Server is up.');
  } catch (err) {
    console.error(`An error occurred during server startup: ${err}`);
  }
})();
