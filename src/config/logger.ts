import winston from 'winston';

const customFormat = winston.format.printf(
  ({ level, message, socket, error, user }) => {
    let log = `${level}: ${message}`;

    if (socket?.id) {
      log += ` (socket.id=${socket.id.substring(0, 5)}...)`;
    }

    if (user?.username) {
      log += ` (user.username=${user.username})`;
    }

    if (error) {
      if (error.stack) {
        log += `\n${error.stack}`;
      } else {
        log += `\n${error}`;
      }
    }

    return log;
  },
);

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ format: customFormat }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
