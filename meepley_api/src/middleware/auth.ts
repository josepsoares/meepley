import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from '../clients/prisma';

export interface AuthRequest extends Request {
  user?: User;
  userQuota?: number;
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;

  if (req?.user) next();

  // get token from the Authorization header
  const token =
    authorization &&
    authorization.split(' ')[0] === 'Bearer' &&
    authorization.split(' ')[1];

  if (token) {
    try {
      // validation of the token
      if (jwt.verify(token, process.env.TOKEN_SECRET)) {
        // extract data from the token
        const { sub: user_id, exp } = jwt.decode(token) as JwtPayload;

        if (exp > Math.floor(Date.now())) {
          const user = await prisma.user.findUnique({
            where: { id: +user_id },
          });

          if (user) {
            req.user = user;
            next();
          }
        } else {
          res.status(401).json({ message: 'Invalid token' });
        }
      }
    } catch (e) {
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    next();
  }
};

export default authMiddleware;
