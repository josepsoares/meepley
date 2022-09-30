import { NextFunction, Request, Response } from 'express';

//! this is not being used because it might be to abstract for everyone to understand

const errWrapper = (
  fn: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    //* this is our function that is on a controller
    //* eg. Achievements.get is wrapped inside this catch because its a promise, so, in this case, fn = Achievemente.get
    //* eg of someone who probably did it better: https://github.com/xiondlph/async-wrapper-express-ts#readme
    return fn(req, res, next).catch(next);
  };
};

export default errWrapper;
