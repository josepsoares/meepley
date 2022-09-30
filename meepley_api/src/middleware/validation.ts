import chalk from 'chalk';
import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain, Result } from 'express-validator';
import { Middleware } from 'express-validator/src/base';

const validation = (
  validations: (
    | ValidationChain
    | (Middleware & { run: (req: Request) => Promise<Result<any>> })
  )[],
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    console.log(chalk.yellow.bold('validation error middleware called 💥'));

    const errWithouthNested = errors.array().map((item) => {
      delete item.nestedErrors;

      return item;
    });

    res.status(400).json({
      message: 'Error(s) while validating data',
      errors: errWithouthNested,
    });
  };
};

export default validation;
