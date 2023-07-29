import cors from 'cors';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import socketio from 'socket.io';

import { Room } from './models/room/Room';
import { User } from './models/user/User';
import { socketRouter } from './router/router';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Battleship server is up.');
});

async function startup() {
  try {
    await connectToMongoDB();
    console.log('Connected to MongoDB.');

    const port = process.env.PORT ?? 8080;
    const server = app.listen(port);
    console.log(`Server listening on port ${port}.`);

    setupSocketIOServer(server);
    console.log(`SocketIO server listening.`);

    setupGracefulShutdown(server);
    console.log('Graceful shutdown is set.');

    console.log('Server startup successful.');
  } catch (err) {
    console.error(`An error occurred during server startup.`, err);
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
    console.log('Could not drop [users] collection.');
  }
  try {
    await Room.db.dropCollection('rooms');
  } catch (err) {
    console.log('Could not drop [rooms] collection.');
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
    console.info('SIGTERM signal received, closing http server.');
    server.close(() => {
      console.log('Http server closed.');
      mongoose.connection.close(false).then(() => {
        console.log('MongoDb connection closed.');
        process.exit(0);
      });
    });
  });
}

startup();
