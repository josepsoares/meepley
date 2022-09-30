import { Role, User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

export interface AdminRequest extends Request {
  user?: User;
}

const adminMiddleware = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== Role.ADMIN) {
    res.send(401);
    return;
  }

  next();
};

export default adminMiddleware;
