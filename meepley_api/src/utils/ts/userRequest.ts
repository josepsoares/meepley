import { Request } from 'express';
import { User as UserPrisma } from '@prisma/client';

export type UserRequest = Request & { user?: UserPrisma };
