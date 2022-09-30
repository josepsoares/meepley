import { NextFunction, Request, Response } from 'express';

import prisma from '../clients/prisma';
import { UserRequest } from '../utils/ts/userRequest';

const AchievementsController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataForNewAchievement = req.body;
      const newAchievement = await prisma.achievement.create({
        data: dataForNewAchievement,
      });

      return res.status(200).json({
        message: 'Created achievement successfully',
        data: newAchievement,
      });
    } catch (err) {
      next(err);
    }
  },
  index: async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { orderByProperty, order, ...queryParams } = req.query;
      const orderProperty = orderByProperty || 'id';
      const orderType = order || 'asc';

      const query = {} as Record<string, any>;

      if (Object.keys(queryParams).length !== 0) {
        if (queryParams?.status) {
          const arr = (queryParams?.status as string).split(',');

          arr.forEach((val) => {
            if (val === 'unblocked') {
              query.AND = [
                { users: { every: { user: { id: req?.user.id } } } },
              ];
            } else {
              query.AND = [
                {
                  users: { every: { user: { isNot: { id: req?.user.id } } } },
                },
              ];
            }
          });
        }

        if (queryParams?.difficulties) {
          query.difficulty = { id: { in: [] } };
          (queryParams?.difficulties as string)
            .split(',')
            .forEach((val) => query.difficulty.id.in.push(+val));
        }

        if (queryParams?.types) {
          query.type = { id: { in: [] } };
          (queryParams?.types as string)
            .split(',')
            .forEach((val) => query.type.id.in.push(+val));
        }

        if (queryParams?.secret) {
          if (query?.AND) {
            query.AND = [
              ...query.AND,
              {
                secret: queryParams?.secret === 'true' ? true : false,
              },
            ];
          } else {
            query.AND = [
              {
                secret: queryParams?.secret === 'true' ? true : false,
              },
            ];
          }
        }

        if (queryParams?.name) {
          query.name = { contains: queryParams.name };
        }
      }

      const achievementsList = await prisma.achievement.findMany({
        include: { difficulty: true, type: true },
        where: Object.keys(queryParams).length !== 0 ? query : {},
        orderBy: {
          [orderProperty as string]:
            orderProperty === 'difficulty' ? { id: orderType } : orderType,
        },
      });

      return res.status(200).json({
        message: 'Returned achievements list successfully',
        data: achievementsList,
      });
    } catch (err) {
      next(err);
    }
  },
  get: async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const achievementId = parseInt(req.params.id);
      const achievement = await prisma.achievement.findFirst({
        where: { id: achievementId },
        include: { difficulty: true, type: true },
      });

      return res.status(200).json({
        message: 'Returned achievement successfully',
        data: achievement,
      });
    } catch (err) {
      next(err);
    }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedData = req.body;
      const achievementId = parseInt(req.params.id);
      const updatedAchievement = await prisma.achievement.update({
        where: { id: achievementId },
        data: updatedData,
      });

      return res.status(200).json({
        message: 'Updated achievement with success',
        data: updatedAchievement,
      });
    } catch (err) {
      next(err);
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const achievementId = parseInt(req.params.id);

      await prisma.achievement.delete({
        where: { id: achievementId },
      });

      return res.status(200).json({
        message: `Deleted achievement, with the id ${achievementId}, successfully`,
      });
    } catch (err) {
      next(err);
    }
  },
  indexDifficulties: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const achivementDifficultiesList =
        await prisma.achievementDifficulty.findMany();

      return res.status(200).json({
        message: 'Returned achievement difficulties successfully',
        data: achivementDifficultiesList,
      });
    } catch (err) {
      next(err);
    }
  },
  indexTypes: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const achievementTypesList = await prisma.achievementType.findMany();

      return res.status(200).json({
        message: 'Returned achievement types successfully',
        data: achievementTypesList,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default AchievementsController;
