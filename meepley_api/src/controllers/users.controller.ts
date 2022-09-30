import { NextFunction, Request, Response } from 'express';
import { UserRequest } from '../utils/ts/userRequest';
import prisma from '../clients/prisma';
import { ErrorCode } from '../middleware/error-handler/errCode';
import { AuthRequest } from '../middleware/auth';

const UsersController = {
  //* func to get a list of users
  index: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          avatar: true,
          boardgame_skill: true,
          calibrated: true,
          username: true,
          created_at: true,
          updated_at: true,
          favorite_days: true,
          name: true,
          boardgame_skills_id: true,
          title: true,
          favorite_boardgame_categories: true,
          favorite_place_types: true,
          matches_played: true,
          provider_name: true,
          provider_token: true,
          place: true,
          places_id: true,
          achievements: { include: { achievement: true } },
          cards: { include: { card: true } },
          favorite_boardgames: { include: { boardgame: true } },
          matchrooms: { include: { matchroom: true } },
          following: { include: { following: true } },
          follower: { include: { follower: true } },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      return res.status(200).json({
        message: 'Returned list of users successfully',
        data: users,
        metadata: {},
      });
    } catch (err) {
      next(err);
    }
  },
  //* func to get an user
  get: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await prisma.user.findFirst({
        where: { id: userId },
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
                  attributes: { include: { attribute: true } },
                  rarity: true,
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

      delete user.password;
      delete user.email;

      return res
        .status(200)
        .json({ message: 'Returned user successfully', data: user });
    } catch (err) {
      next(err);
    }
  },
  //* func to update an user
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.id);
      const queryParams = req.query;

      if (queryParams?.username) {
        const isUsernameAlreadyInUse = await prisma.user.findFirst({
          where: { username: queryParams.username as string },
          rejectOnNotFound: false,
        });

        if (isUsernameAlreadyInUse) {
          return res.status(400).json({ message: 'Username already in use' });
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: queryParams,
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
                  attributes: { include: { attribute: true } },
                  rarity: true,
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

      delete updatedUser.password;
      delete updatedUser.email;

      return res
        .status(200)
        .json({ message: 'Updated user sucessfully', data: updatedUser });
    } catch (err) {
      next(err);
    }
  },
  //* func to delete an user
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.id);

      await prisma.user.delete({
        where: { id: userId },
      });

      return res.status(200).json({
        message: `Deleted user, with the id ${userId}, successfully`,
      });
    } catch (err) {
      next(err);
    }
  },
  calibrate: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const calibrationData = req.body;

      const userId = parseInt(req.params.id);

      await prisma.user.update({
        where: { id: userId },
        data: calibrationData.calibrated
          ? {
              calibrated: true,
              favorite_days: calibrationData.favorite_days,
              boardgame_skill: {
                connect: { id: calibrationData.boardgame_skill.id },
              },
              favorite_boardgame_categories: {
                createMany: {
                  skipDuplicates: true,
                  data: [
                    ...calibrationData.favorite_boardgame_categories.map(
                      (item) => ({
                        boardgame_categories_id: item.id,
                      }),
                    ),
                  ],
                },
              },
              favorite_place_types: {
                createMany: {
                  skipDuplicates: true,
                  data: [
                    ...calibrationData.favorite_place_types.map((item) => ({
                      place_types_id: item.id,
                    })),
                  ],
                },
              },
            }
          : { calibrated: false },
      });

      return res.status(200).json({ message: 'Calibrated user successfully' });
    } catch (err) {
      next(err);
    }
  },
  updateCalibration: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return null;
  },
  updateFavoriteBoardgames: async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await prisma.userHasFavoriteBoardgames.findFirst({
        where: { boardgames_id: +req.params.id, users_id: req.user.id },
      });

      //* means the boardgame was already in the users favorites
      //* so we remove it from their list
      const removeBgFromFavorites = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          favorite_boardgames: {
            delete: {
              users_id_boardgames_id: {
                boardgames_id: +req.params.id,
                users_id: req.user.id,
              },
            },
          },
        },
        include: {
          favorite_boardgames: { include: { boardgame: true } },
        },
      });

      return res.status(200).json({
        data: removeBgFromFavorites.favorite_boardgames,
        action: 'REMOVE',
        message: `Removed boardgame with the id - ${req.params.id} - from the users favorite list successfully`,
      });
    } catch (err) {
      if (err?.message === ErrorCode.NotFound) {
        //* means the boardgame wasnt in the users favorites
        //* so we add it to their list
        const addBgToFavorites = await prisma.user.update({
          where: { id: req.user.id },
          data: {
            favorite_boardgames: {
              create: { boardgames_id: +req.params.id },
            },
          },
          include: {
            favorite_boardgames: { include: { boardgame: true } },
          },
        });

        return res.status(200).json({
          data: addBgToFavorites.favorite_boardgames,
          action: 'ADD',
          message: `Added boardgame with the id - ${req.params.id} - to the users favorite list successfully`,
        });
      } else {
        next(err);
      }
    }
  },
  followUser: async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      await prisma.user.update({
        where: { id: req.user.id },
        data: {
          favorite_boardgames: {
            create: { boardgames_id: +req.params.id },
          },
        },
      });

      await prisma.user.update({
        where: { id: req.user.id },
        data: {
          favorite_boardgames: {
            create: { boardgames_id: +req.params.id },
          },
        },
      });

      return res.status(200).json({
        message: `Added boardgame with the id - ${req.params.id} - to the users favorite list successfully`,
      });
    } catch (err) {
      next(err);
    }
  },
  unfollowUser: async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      await prisma.user.update({
        where: { id: req.user.id },
        data: {
          favorite_boardgames: {
            delete: {
              users_id_boardgames_id: {
                boardgames_id: +req.params.id,
                users_id: req.user.id,
              },
            },
          },
        },
      });

      await prisma.user.update({
        where: { id: req.user.id },
        data: {
          favorite_boardgames: {
            delete: {
              users_id_boardgames_id: {
                boardgames_id: +req.params.id,
                users_id: req.user.id,
              },
            },
          },
        },
      });

      return res.status(200).json({
        message: `Removed boardgame with the id - ${req.params.id} - from the users favorite list successfully`,
      });
    } catch (err) {
      next(err);
    }
  },
  indexFollowers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const followersList = await prisma.userFollow.findMany({
        where: {
          follower_id: parseInt(req.query.follower_id as string),
        },
      });

      return res.status(200).json({
        message: 'Returned followers successfully',
        data: followersList,
      });
    } catch (err) {
      next(err);
    }
  },
  indexFollowing: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const followingList = await prisma.userFollow.findMany({
        where: {
          following_id: parseInt(req.query.following_id as string),
        },
      });

      return res.status(200).json({
        message: 'Returned following users sucessfully',
        data: followingList,
      });
    } catch (err) {
      next(err);
    }
  },
  uploadAndUpdateAvatar: async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (req.file == undefined) {
        return res.status(400).send({ message: 'File not found' });
      }

      const userId = parseInt(req.params.id);
      const avatarPath = `${process.env.CDN_BASE_PATH}/avatars/${req.file.filename}`;

      req.userQuota += req.file.size;

      await prisma.user.update({
        where: { id: userId },
        data: {
          avatar: avatarPath,
        },
      });

      return res.status(200).json({
        avatar: avatarPath,
        message: 'Update avatar sucessfully',
      });
    } catch (err) {
      next(err);
    }
  },
  createUserBugReport: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const bugReportDescription = req.body.description;

      const userId = parseInt(req.params.id);

      const userBugReportsNumber = await prisma.userBugReport.findMany({
        where: { user_id: userId },
      });

      if (userBugReportsNumber.length === 3) {
        return res.status(400).json({
          message:
            'The user has already created the estipulated limit of bug reports',
        });
      }

      await prisma.userBugReport.create({
        data: {
          description: bugReportDescription,
          user: { connect: { id: userId } },
        },
      });

      return res.status(200).json({
        message: 'Created bug report sucessfully',
      });
    } catch (err) {
      next(err);
    }
  },
};

export default UsersController;
