import path from 'path';
import winston from 'winston';

export default {
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.timestamp(),
  ),
  transports: [
    new winston.transports.Console({}),
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      format: winston.format.timestamp(),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/info.log'),
      format: winston.format.timestamp(),
      level: 'info',
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/puppeteer.log'),
      format: winston.format.timestamp(),
      level: 'puppeteer',
    }),
  ],
};
