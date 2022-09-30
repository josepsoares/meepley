import { NextFunction, Request, Response } from 'express';
import * as argon2 from 'argon2';
import prisma from '../clients/prisma';

import { ErrorCode } from '../middleware/error-handler/errCode';
import { ErrorException } from '../middleware/error-handler/errException';
import generateToken from '../utils/helpers/generateToken';
import { nanoid } from 'nanoid';

const AuthController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findFirst({
        where: { email: email },
        include: {
          achievements: {
            include: {
              achievement: { include: { difficulty: true, type: true } },
            },
          },
          cards: {
            include: {
              card: {
                include: {
                  rarity: true,
                  attributes: { include: { attribute: true } },
                },
              },
            },
          },
          favorite_boardgames: { include: { boardgame: true } },
          matchrooms: { include: { matchroom: true } },
          following: { include: { following: true } },
          follower: { include: { follower: true } },
        },
      });

      if (!user) {
        throw new ErrorException(ErrorCode.NotFound, 'User doesnt exist');
      }

      const isPasswordValid = await argon2.verify(user.password, password);

      if (!isPasswordValid) {
        throw new ErrorException(
          ErrorCode.InvalidPassword,
          'Password incorrect',
        );
      }

      delete user.password;
      delete user.email;

      const token = generateToken(`${user.id}`);

      return res.status(200).json({
        message: 'Logged in successfully',
        data: { user: user, jwt: token },
      });
    } catch (err) {
      next(err);
    }
  },
  signInWithFacebook: (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(200)
        .json({ message: 'Logged in with provider successfully', data: '' });
    } catch (err) {
      next(err);
    }
  },
  signInWithGoogle: (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(200)
        .json({ message: 'Logged in with provider successfully', data: '' });
    } catch (err) {
      next(err);
    }
  },
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name } = req.body;
      const { type } = req.query;

      const user = await prisma.user.findFirst({
        where: { email: email },
      });

      if (!user) {
        const hashedPassword = await argon2.hash(password, { hashLength: 40 });
        const randomNums = nanoid(8);

        const username = req.body?.username
          ? req.body.username
          : `${name.replace(/ /g, '_').toLowerCase()}_${randomNums}`;

        // TODO - finish correctly the create establishment account
        const newUser = await prisma.user.create({
          data:
            type === 'place'
              ? {
                  calibrated: undefined,
                  password: hashedPassword,
                  name: name,
                  username: username,
                  avatar: 'https://meepley.pt/cdn/avatars/preset.png',
                  email: email,
                  place: {
                    connectOrCreate: {
                      where: { id: req.body.place.id },
                      create: {
                        address: '',
                        hours_open: '',
                        image: '',
                        latitude: 1.1,
                        longitude: 1.1,
                        name: '',
                        minimum_consumption: 1,
                        open_days: '',
                        // boardgames: '',
                        sells_boardgames: false,
                        city: 'AVEIRO',
                      },
                    },
                  },
                }
              : {
                  calibrated: undefined,
                  password: hashedPassword,
                  name: name,
                  username: username,
                  avatar: 'https://meepley.pt/cdn/avatars/preset.png',
                  email: email,
                },
          include: {
            achievements: { include: { achievement: true } },
            cards: { include: { card: true } },
            favorite_boardgames: { include: { boardgame: true } },
            matchrooms: { include: { matchroom: true } },
            following: { include: { following: true } },
            follower: { include: { follower: true } },
          },
        });

        delete newUser.password;
        delete newUser.email;

        return res
          .status(200)
          .json({ message: 'Registered successfully', data: '' });
      } else {
        throw new ErrorException(ErrorCode.UnknownError, 'User already exists');
      }
    } catch (err) {
      next(err);
    }
  },

  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.user.update({ where: { id: req.body.id }, data: {} });

      return res.status(200).json({ message: 'Updated password successfully' });
    } catch (err) {
      next(err);
    }
  },
  verifyEmail: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.user.update({ where: { id: req.body.id }, data: {} });

      return res.status(200).json({ message: 'Verified email successfully' });
    } catch (err) {
      next(err);
    }
  },
  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(200)
        .json({ message: 'Refreshed token successfully', data: '' });
    } catch (err) {
      next(err);
    }
  },
};

export default AuthController;
