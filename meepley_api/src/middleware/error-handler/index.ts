import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';

import logger from '../../utils/logger';
import { ErrorException } from './errException';

const errHandler = (
  err: Prisma.PrismaClientKnownRequestError | ErrorException | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(chalk.yellow.bold('error handling middleware called 💥'));

  if (
    err instanceof ErrorException ||
    err instanceof Prisma.PrismaClientKnownRequestError
  ) {
    //* this is a known error, thown by us or by Prisma

    let errorStatus: number, errorMessage: string;

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      errorStatus = 500;
      errorMessage = err.message;

      switch (err.code) {
        case 'P2002':
          errorStatus = 400;
          break;
        case 'P2025':
          errorStatus = 404;
          errorMessage =
            'An operation failed because it depends on one or more records that were required but not found. Record to update not found.';
        default:
          break;
      }

      logger.error(`prisma error => code ${err.code}, status ${errorStatus}`);
    } else {
      errorStatus = err.status;
      errorMessage = err?.metaData || err.message;

      logger.error(`manual triggered error =>`, err.message);
    }

    res
      .status(errorStatus)
      .json(
        err.name === 'The operation failed because of an unknow error'
          ? { message: errorMessage, error: err.stack }
          : { message: errorMessage },
      );
  } else {
    //* this is a totally unknown error
    logger.error('generic error => unknown general error');

    console.log(err.stack, err.name, err.message);

    res.status(500).json({ message: err.message, error: err.message });
  }
};

export default errHandler;
