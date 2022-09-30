import { NextFunction, Request, Response } from 'express';
import prisma from '../clients/prisma';

const BoardgamesController = {
  index: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = parseInt(req.query.take as string);

      const queryPaginationParams:
        | { take: number }
        | { skip: number; take: number; cursor: { id: number } } =
        parseInt(req.query.cursor as string) === 0
          ? { take: parseInt(req.query.take as string) }
          : {
              skip: 1,
              take: parseInt(req.query.take as string),
              cursor: {
                id: parseInt(req.query.cursor as string),
              },
            };

      const { order_prop, order_type, cursor, take, ...queryParams } =
        req.query;
      const orderProperty = order_prop || 'rank';
      const order = order_type || 'asc';

      const query = { OR: [] } as Record<string, any>;

      if (Object.keys(queryParams).length !== 0) {
        if (queryParams?.mechanics) {
          query.mechanics.in = [];
          (queryParams?.mechanics as string)
            .split(',')
            .forEach((val) => query.mechanics.in.push(+val));
        }

        if (queryParams?.categories) {
          query.categories.in = [];
          (queryParams?.categories as string)
            .split(',')
            .forEach((val) => query.categories.in.push(+val));
        }

        if (queryParams?.difficulties) {
          query.difficulties.in = [];
          (queryParams?.difficulties as string)
            .split(',')
            .forEach((val) => query.difficulties.in.push(+val));
        }

        if (queryParams?.min_players) {
          query.AND.min_players = { id: +queryParams?.min_players };
        }

        if (queryParams?.max_players) {
          query.AND.max_players = { id: +queryParams?.max_players };
        }

        if (queryParams?.name) {
          query.name.search = queryParams.name;
        }
      }

      const boardgamesList = await prisma.boardgame.findMany({
        ...queryPaginationParams,
        where: Object.keys(queryParams).length !== 0 ? query : {},
        select: {
          id: true,
          name: true,
          max_players: true,
          min_players: true,
          categories: { include: { category: true } },
          image: true,
          thumbnail: true,
          difficulty: true,
          // avg_playtime:
        },
        orderBy: {
          [orderProperty as string]: order,
        },
      });

      return res.status(200).json({
        message: 'Returned boardgames list succesfully',
        data: boardgamesList,
        metadata: {
          next_id:
            boardgamesList.length === limit
              ? boardgamesList[limit - 1].id + 1
              : undefined,
        },
      });
    } catch (err) {
      next(err);
    }
  },
  get: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardgameId = parseInt(req.params.id);
      const boardgame = await prisma.boardgame.findFirst({
        where: { id: boardgameId },
        include: {
          categories: { include: { category: true } },
          mechanics: { include: { mechanic: true } },
        },
      });

      return res
        .status(200)
        .json({ message: 'Returned boardgame successfully', data: boardgame });
    } catch (err) {
      next(err);
    }
  },
  indexCategories: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardgameCategoriesList = await prisma.boardgameCategory.findMany();

      return res.status(200).json({
        message: 'Returned boardgame categories successfully',
        data: boardgameCategoriesList,
      });
    } catch (err) {
      next(err);
    }
  },
  indexCalibrationCategories: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const boardgameCategoriesList = await prisma.boardgameCategory.findMany({
        where: {
          name: {
            in: [
              'Adventure',
              'Abstract Strategy',
              'Horror',
              'Wargame',
              'Card Game',
              'Party Game',
              'Educational',
              'Fantasy',
              'Murder/Mystery',
              'Puzzle',
              'Science Fiction',
              'Sports',
              'Medieval',
            ],
          },
        },
      });

      return res.status(200).json({
        message: 'Returned boardgame categories successfully',
        data: boardgameCategoriesList,
      });
    } catch (err) {
      next(err);
    }
  },
  indexMechanics: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardgameMechanicsList = await prisma.boardgameMechanic.findMany();

      return res.status(200).json({
        message: 'Returned boardgame mechanics successfully',
        data: boardgameMechanicsList,
      });
    } catch (err) {
      next(err);
    }
  },
  indexSkills: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardgamesSkillsList = await prisma.boardgameSkill.findMany();

      return res.status(200).json({
        message: 'Returned boardgame skills successfully',
        data: boardgamesSkillsList,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default BoardgamesController;
