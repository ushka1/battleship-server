import cors from 'cors';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import socketio from 'socket.io';

import { logger } from 'config/logger';
import { Room } from './models/Room';
import { User } from './models/User';
import { socketRouter } from './router/router';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Material Ships server is up.');
});

async function startup() {
  try {
    await connectToMongoDB();
    logger.info('MongoDB connected.');

    const port = process.env.PORT ?? 8080;
    const server = app.listen(port);
    logger.info(`Server listening on port ${port}.`);

    setupSocketIOServer(server);
    logger.info(`SocketIO server up.`);

    setupGracefulShutdown(server);
    logger.info('Graceful shutdown set.');

    logger.info('Server startup successful.');
  } catch (err) {
    logger.error(`Server startup error.`, { err });
  }
}

async function connectToMongoDB() {
  await mongoose.connect(process.env.DB_CONNECT_URI, {
    dbName: process.env.DB_NAME,
    auth: {
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USERNAME,
    },
    authSource: process.env.DB_AUTH_SOURCE,
  });

  if (process.env.NODE_ENV === 'development') {
    await dropMongoDBCollections();
  }
}

/**
 * Development-only utility function for clearing database.
 */
async function dropMongoDBCollections() {
  try {
    await User.db.dropCollection('users');
  } catch (err) {
    logger.info('Could not drop collection [users].');
  }
  try {
    await Room.db.dropCollection('rooms');
  } catch (err) {
    logger.info('Could not drop collection [rooms].');
  }
}

function setupSocketIOServer(server: http.Server) {
  const io = new socketio.Server(server, {
    cors: { origin: process.env.SOCKET_ORIGIN, methods: ['GET', 'POST'] },
  });

  io.on('connection', (socket) => socketRouter(socket, io));
}

function setupGracefulShutdown(server: http.Server) {
  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received.');
    server.close(() => {
      logger.info('Http server closed.');
      mongoose.connection.close(false).then(() => {
        logger.info('MongoDB disconnected.');
        process.exit(0);
      });
    });
  });
}

startup();
