import dayjs from 'dayjs';
import { NextFunction, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import prisma from '../clients/prisma';
import scheduleEndMatchroomJob from '../jobs/endMatchroom';
import { ErrorCode } from '../middleware/error-handler/errCode';
import { ErrorException } from '../middleware/error-handler/errException';
import { UserRequest } from '../utils/ts/userRequest';

const MatchroomsController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inviteCode = nanoid(8);

      const { user, place, boardgames, ...data } = req.body;

      let parseDuration: number;

      if (req.body.estimated_duration.search('minutos')) {
        parseDuration = parseInt(req.body.estimated_duration) * 60;
      } else if (req.body.estimated_duration.search('horas')) {
        parseDuration = parseInt(req.body.estimated_duration) * 60 * 60;
      } else {
        if (req.body.estimated_duration.search('O dia todo')) {
          parseDuration = 24 * 60 * 60;
        } else {
          parseDuration = 168 * 60 * 60;
        }
      }

      const newMatchroom = await prisma.matchroom.create({
        data: {
          ...data,
          invite_code: inviteCode,
          scheduled_end_date: dayjs()
            .add(parseDuration, 'second')
            .add(4, 'hour')
            .format(),
          boardgames: {
            createMany: {
              data: boardgames.map((item) => {
                return { boardgames_id: item.id };
              }),
            },
          },
          place: {
            connect: { id: place },
          },
          users: {
            create: {
              user: {
                connect: { id: user },
              },
            },
          },
          admin: {
            connect: { id: user },
          },
        },
        include: {
          place: true,
          boardgames: { include: { boardgame: true } },
          users: { include: { user: true } },
          admin: true,
        },
      });

      scheduleEndMatchroomJob(
        nanoid(12),
        newMatchroom.scheduled_end_date,
        newMatchroom.id,
      );

      return res.status(200).json({
        message: 'Created matchroom successfully',
        data: newMatchroom,
      });
    } catch (err) {
      next(err);
    }
  },
  index: async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const matchroomsList = await prisma.matchroom.findMany({
        include: {
          place: true,
          boardgames: { include: { boardgame: true } },
          users: { include: { user: true } },
          admin: true,
        },
        orderBy: { created_at: 'desc' },
      });

      if (matchroomsList.length === 0) {
        throw new ErrorException(ErrorCode.NotFound, 'Matchrooms not found');
      }

      return res.status(200).json({
        message: 'Returned list of matchrooms successfully',
        data: matchroomsList,
        metadata: {},
      });
    } catch (err) {
      next(err);
    }
  },
  indexRecommended: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recommendedMatchroomsList = await prisma.matchroom.findMany({
        where: {
          is_ongoing: false,
        },
        include: {
          place: true,
          boardgames: { include: { boardgame: true } },
          users: { include: { user: true } },
          admin: true,
        },
        orderBy: { created_at: 'desc' },
      });

      if (recommendedMatchroomsList.length === 0) {
        throw new ErrorException(ErrorCode.NotFound, 'Not matchrooms founded');
      }

      return res.status(200).json({
        message: 'Returned list of recommended matchrooms successfully',
        data: recommendedMatchroomsList,
        metadata: {},
      });
    } catch (err) {
      next(err);
    }
  },
  indexDivergent: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const divergentMatchroomsList = await prisma.matchroom.findMany({
        where: {
          is_ongoing: false,
        },
        include: {
          place: true,
          boardgames: { include: { boardgame: true } },
          users: { include: { user: true } },
          admin: true,
        },
        orderBy: { created_at: 'desc' },
      });

      if (divergentMatchroomsList.length === 0) {
        throw new ErrorException(ErrorCode.NotFound, 'Not matchrooms founded');
      }

      return res.status(200).json({
        message: 'Returned list of divergent matchrooms successfully',
        data: divergentMatchroomsList,
        metadata: {},
      });
    } catch (err) {
      next(err);
    }
  },
  indexUserMatchrooms: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = parseInt(req.params.id);

      const userMatchrooms = await prisma.matchroom.findMany({
        where: {
          is_ongoing: false,
        },
        select: {
          place: true,
          boardgames: { include: { boardgame: true } },
          users: {
            where: {
              users_id: userId,
            },
          },
          admin: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      if (userMatchrooms.length === 0) {
        throw new ErrorException(ErrorCode.NotFound, 'Not matchrooms founded');
      }

      return res.status(200).json({
        message:
          'Returned list of matchrooms of the specific user successfully',
        data: userMatchrooms,
      });
    } catch (err) {
      next(err);
    }
  },
  get: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const matchroomId = parseInt(req.params.id);
      const matchroom = await prisma.matchroom.findFirst({
        where: { id: matchroomId },
        include: {
          place: true,
          boardgames: { include: { boardgame: true } },
          users: { include: { user: true } },
          admin: true,
        },
      });

      return res
        .status(200)
        .json({ message: 'Returned matchroom successfully', data: matchroom });
    } catch (err) {
      next(err);
    }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedData = req.body;
      const matchroomId = parseInt(req.params.id);

      const updatedMatchroom = await prisma.matchroom.update({
        where: { id: matchroomId },
        data: updatedData,
      });

      return res.status(200).json({
        message: 'Updated matchroom successfully',
        data: updatedMatchroom,
      });
    } catch (err) {
      next(err);
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const matchroomId = parseInt(req.params.id);

      await prisma.matchroom.delete({
        where: { id: matchroomId },
      });

      return res.status(200).json({
        message: `Deleted matchroom, with the id ${matchroomId}, successfully`,
      });
    } catch (err) {
      next(err);
    }
  },
  abandon: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const matchroomId = parseInt(req.query.matchroom_id as string);
      const userId = parseInt(req.query.user_id as string);

      await prisma.matchroom.update({
        where: {
          id: matchroomId,
        },
        data: {
          users: {
            delete: {
              matchrooms_id_users_id: {
                matchrooms_id: matchroomId,
                users_id: userId,
              },
            },
          },
        },
      });

      return res
        .status(200)
        .json({ message: 'Abandoned matchroom successfully' });
    } catch (err) {
      next(err);
    }
  },
  enter: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const matchroomId = parseInt(req.query.matchroom_id as string);
      const userId = parseInt(req.query.user_id as string);

      await prisma.matchroom.update({
        where: {
          id: matchroomId,
        },
        data: {
          users: {
            create: {
              user: {
                connect: {
                  id: userId,
                },
              },
            },
          },
        },
      });

      return res
        .status(200)
        .json({ message: 'Abandoned matchroom successfully' });
    } catch (err) {
      next(err);
    }
  },
  enterViaCode: async (req: Request, res: Response, next: NextFunction) => {
    return {};
  },
  checkUserMatchroomFeedback: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = +req.params.id;

      const matchroomToEvaluate = await prisma.matchroomHasUsers.findFirst({
        where: {
          users_id: userId,
          user_feedback: true,
        },
        select: {
          matchroom: { include: { place: true } },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      return res.status(200).json({
        message: 'Returned matchroom in need of user evaluation',
        data: matchroomToEvaluate.matchroom,
      });
    } catch (err) {
      next(err);
    }
  },
  createSubmittedFeedback: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { user_id, matchroom_id, place_id, rating } = req.body;

      const matchroomFeedback = await prisma.matchroomFeedback.create({
        data: {
          feedback_rating: rating,
          matchroom: { connect: { id: matchroom_id } },
          place: { connect: { id: place_id } },
          user: { connect: { id: user_id } },
        },
      });

      await prisma.matchroom.update({
        where: {
          id: matchroom_id,
        },
        data: {
          users: {
            update: {
              where: {
                matchrooms_id_users_id: {
                  users_id: user_id,
                  matchrooms_id: matchroom_id,
                },
              },
              data: { user_feedback: false },
            },
          },
        },
      });

      //* calculate average rating of a specific place
      const aggregations = await prisma.matchroomFeedback.aggregate({
        _avg: {
          feedback_rating: true,
        },
      });

      await prisma.place.update({
        where: {
          id: place_id,
        },
        data: {
          average_rating: aggregations._avg.feedback_rating,
        },
      });

      return res.status(200).json({
        message: 'Cereated matchroom feedback successfully',
        data: matchroomFeedback,
      });
    } catch (err) {
      next(err);
    }
  },
  skipUserMatchroomFeedback: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { user_id, matchroom_id } = req.body;

      await prisma.matchroom.update({
        where: {
          id: matchroom_id,
        },
        data: {
          users: {
            update: {
              where: {
                matchrooms_id_users_id: {
                  users_id: user_id,
                  matchrooms_id: matchroom_id,
                },
              },
              data: { user_feedback: false },
            },
          },
        },
      });

      return res.status(200).json({
        message: 'Skipped matchroom evaluation successfully',
      });
    } catch (err) {
      next(err);
    }
  },
  deleteFeedback: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const matchroomId = parseInt(req.params.id);

      await prisma.matchroomFeedback.delete({
        where: { id: matchroomId },
      });

      return res.status(200).json({
        message: 'Matchroom feedback deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  },
};

export default MatchroomsController;
