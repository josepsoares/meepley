import { NextFunction, Request, Response } from 'express';
import prisma from '../clients/prisma';
import { UserRequest } from '../utils/ts/userRequest';

const CardsController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataForNewCard = req.body;
      const card = await prisma.card.create({ data: dataForNewCard });

      return res
        .status(200)
        .json({ message: 'Created card successfully', data: card });
    } catch (err) {
      next(err);
    }
  },
  index: async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { order_prop, order_type, ...queryParams } = req.query;
      const orderProperty = order_prop || 'id';
      const order = order_type || 'asc';

      const query = { OR: [] } as Record<string, any>;

      if (Object.keys(queryParams).length !== 0) {
        if (queryParams?.status) {
          const arr = (queryParams?.status as string).split(',');

          arr.forEach((val) => {
            if (val === 'obtained') {
              query.AND.push({ users: { every: { user: { id: 1 } } } });
            } else {
              query.AND.push({
                users: { every: { user: { isNot: { id: 1 } } } },
              });
            }
          });
        }

        if (queryParams?.rarities) {
          query.rarity.in = [];
          (queryParams?.rarities as string)
            .split(',')
            .forEach((val) => query.rarity.in.push(+val));
        }

        if (queryParams?.attributes) {
          query.attributes.in = [];
          (queryParams?.attributes as string)
            .split(',')
            .forEach((val) => query.attributes.in.push(+val));
        }

        if (queryParams?.name) {
          query.name.search = queryParams.name;
        }
      }

      const cardsList = await prisma.card.findMany({
        include: {
          attributes: { include: { attribute: true } },
          rarity: true,
        },
        where: Object.keys(queryParams).length !== 0 ? query : {},
        orderBy: {
          [orderProperty as string]: order,
        },
      });

      return res.status(200).json({
        message: 'Returned list of cards successfully',
        data: cardsList,
      });
    } catch (err) {
      next(err);
    }
  },
  get: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cardId = parseInt(req.params.id);
      const card = await prisma.card.findFirst({
        where: { id: cardId },
        include: {
          attributes: { include: { attribute: true } },
          rarity: true,
        },
      });

      return res
        .status(200)
        .json({ message: 'Returned card successfully', data: card });
    } catch (err) {
      next(err);
    }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedData = req.body;
      const cardId = parseInt(req.params.id);
      const updatedCard = await prisma.card.update({
        where: { id: cardId },
        data: updatedData,
      });

      return res
        .status(200)
        .json({ message: 'Updated card successfully', data: updatedCard });
    } catch (err) {
      next(err);
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cardId = parseInt(req.params.id);

      await prisma.card.delete({
        where: { id: cardId },
      });

      return res.status(200).json({
        message: `Deleted card, with the id ${cardId}, successfully`,
      });
    } catch (err) {
      next(err);
    }
  },
  indexRarities: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cardRaritiesList = await prisma.cardRarity.findMany();

      return res.status(200).json({
        message: 'Returned list of card rarities successfully',
        data: cardRaritiesList,
      });
    } catch (err) {
      next(err);
    }
  },
  indexAttributes: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cardAttributesList = await prisma.cardAttribute.findMany();

      return res.status(200).json({
        message: 'Returned list of card attributes successfully',
        data: cardAttributesList,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default CardsController;
