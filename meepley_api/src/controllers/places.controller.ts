import { NextFunction, Request, Response } from 'express';
import prisma from '../clients/prisma';

const PlacesController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataForNewPlace = req.body;
      const newPlace = await prisma.place.create({ data: dataForNewPlace });

      return res
        .status(200)
        .json({ message: 'Created place successfully', data: newPlace });
    } catch (err) {
      next(err);
    }
  },
  index: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { order_prop, order_type, ...queryParams } = req.query;
      const orderProperty = order_prop || 'id';
      const order = order_type || 'asc';

      const query = { OR: [] } as Record<string, any>;

      if (Object.keys(queryParams).length !== 0) {
        if (queryParams?.name) {
          query.name.search = queryParams.name;
        }

        if (queryParams?.cities) {
          query.rarity.in = [];
          (queryParams?.rarities as string)
            .split(',')
            .forEach((val) => query.rarity.in.push(+val));
        }

        if (queryParams?.types) {
          query.types.in = [];
          (queryParams?.types as string)
            .split(',')
            .forEach((val) => query.types.in.push(+val));
        }

        if (queryParams?.sellsBoardgames) {
          query.AND = {
            secret: queryParams?.sellsBoardgames === 'true' ? true : false,
          };
        }

        if (queryParams?.hasBoardgames) {
          query.AND = {
            secret: queryParams?.hasBoardgames === 'true' ? true : false,
          };
        }

        if (queryParams?.minimumConsumptions) {
          query.types.in = [];
          (queryParams?.minimumConsumptions as string)
            .split(',')
            .forEach((val) => query.types.in.push(+val));
        }

        /*       cities
        types
        sellsBoardgames
        hasBoardgames
        hasMatchrooms
        minimumConsumptions */
      }

      const places = await prisma.place.findMany({
        include: {
          types: {
            include: { type: true },
          },
          matchrooms: true,
          boardgames: { include: { boardgames: true } },
        },
        where: Object.keys(queryParams).length !== 0 ? query : {},
        orderBy: {
          [orderProperty as string]: order,
        },
      });

      return res
        .status(200)
        .json({ message: 'Returned places successfully', data: places });
    } catch (err) {
      next(err);
    }
  },
  get: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const placeId = parseInt(req.params.id);
      const place = await prisma.place.findFirst({
        where: { id: placeId },
        include: {
          types: {
            include: { type: true },
          },
          matchrooms: true,
          boardgames: { include: { boardgames: true } },
        },
      });

      return res
        .status(200)
        .json({ message: 'Returned place successfully', data: place });
    } catch (err) {
      next(err);
    }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedData = req.body;
      const placeId = parseInt(req.params.id);
      const updatedPlace = await prisma.place.update({
        where: { id: placeId },
        data: updatedData,
      });

      return res
        .status(200)
        .json({ message: 'Updated place successfully', data: updatedPlace });
    } catch (err) {
      next(err);
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const placeId = parseInt(req.params.id as string);
      await prisma.place.delete({ where: { id: placeId } });

      return res.status(200).json({
        message: `Deleted place, with the id ${placeId}, successfully`,
      });
    } catch (err) {
      next(err);
    }
  },
  indexTypes: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const placeTypes = await prisma.placeType.findMany();

      return res.status(200).json({
        message: 'Returned place types successfully',
        data: placeTypes,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default PlacesController;
