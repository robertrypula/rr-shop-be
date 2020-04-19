import { Router } from 'express';

import { adminOrderRouter } from './admin-order';
import { adminUserRouter } from './admin-user';
import { adminProductRouter } from './product-order';

export const adminRoutes = Router();

adminRoutes.use('/order', adminOrderRouter);
adminRoutes.use('/user', adminUserRouter);
adminRoutes.use('/product', adminProductRouter);
