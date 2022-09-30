import winston from 'winston';
import logging from '../config/logging';

const logger = winston.createLogger(logging);

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

export default logger;
