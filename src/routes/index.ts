import { Router } from 'express';

import { authRouter } from './auth';
import { productRouter } from './product';
import { userRouter } from './user';

export const routes = Router();

routes.use('/auth', authRouter);
routes.use('/product', productRouter);
routes.use('/user', userRouter);
