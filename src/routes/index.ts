import { Router, Request, Response } from 'express';
import { authRouter } from './auth';
import { userRouter } from './user';

export const routes = Router();

routes.use('/auth', authRouter);
routes.use('/user', userRouter);
