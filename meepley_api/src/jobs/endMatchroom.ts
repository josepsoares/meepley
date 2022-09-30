import * as schedule from 'node-schedule';
import prisma from '../clients/prisma';

const scheduleEndMatchroomJob = (jobId: string, date, matchroomId: number) => {
  return schedule.scheduleJob(date, async () => {
    try {
      const matchroom = await prisma.matchroom.findFirst({
        where: { id: matchroomId },
        include: {
          place: true,
          boardgames: { include: { boardgame: true } },
          users: { include: { user: true } },
          admin: true,
        },
      });

      await prisma.matchroom.update({
        where: { id: matchroomId },
        data: {
          is_ongoing: false,
          finished: true,
        },
      });

      for (const user of matchroom.users) {
        await prisma.user.update({
          where: { id: user.users_id },
          data: {
            matches_played: (user.user.matches_played += 1),
          },
        });

        await prisma.matchroomHasUsers.update({
          where: {
            matchrooms_id_users_id: {
              matchrooms_id: matchroomId,
              users_id: user.users_id,
            },
          },
          data: { user_feedback: true },
        });
      }
    } catch (err) {
      schedule.cancelJob(jobId);
    }
  });
};

export default scheduleEndMatchroomJob;
