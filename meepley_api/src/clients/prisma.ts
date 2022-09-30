//* import this file and using this PrismaClient instance anywhere.
import { PrismaClient } from '@prisma/client';
import { ErrorCode } from '../middleware/error-handler/errCode';
import { ErrorException } from '../middleware/error-handler/errException';

interface CustomNodeJsGlobal {
  prisma: PrismaClient;
}

declare const global: CustomNodeJsGlobal;

const prisma =
  global.prisma ||
  new PrismaClient({
    rejectOnNotFound: {
      findFirst: (err: Error) => new ErrorException(ErrorCode.NotFound),
      findUnique: (err: Error) => new ErrorException(ErrorCode.NotFound),
    },
  });

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

prisma.$use(async (params, next) => {
  const before = Date.now();

  const result = await next(params);

  const after = Date.now();

  console.log(
    `Query ${params.model}.${params.action} took ${after - before}ms`,
  );

  return result;
});

export default prisma;
