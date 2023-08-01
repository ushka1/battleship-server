import winston from 'winston';

const socketFormat = winston.format.printf(
  ({ level, message, socket, err }) => {
    let log: string;

    if (socket?.id) {
      log = `${level}: ${message} (socket.id=${socket.id.substring(0, 5)}...)`;
    } else {
      log = `${level}: ${message}`;
    }

    if (err) {
      if (err.stack) {
        log += `\n${err.stack}`;
      } else {
        log += `\n${err}`;
      }
    }

    return log;
  },
);

export const logger = winston.createLogger({
  transports: [
    // new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.Console({ format: socketFormat }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
