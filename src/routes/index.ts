import { Router } from 'express';

import { authRouter } from './auth';
import { categoryRouter } from './category';
import { payURouter } from './pay-u';
import { productRouter } from './product';
import { userRouter } from './user';

export const routes = Router();

routes.use('/auth', authRouter);
routes.use('/category', categoryRouter);
routes.use('/pay-u', payURouter);
routes.use('/product', productRouter);
routes.use('/user', userRouter);
