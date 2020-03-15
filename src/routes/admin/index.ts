import { Router } from 'express';

import { adminOrderRouter } from './admin-order';
import { adminUserRouter } from './admin-user';

export const adminRoutes = Router();

adminRoutes.use('/order', adminOrderRouter);
adminRoutes.use('/user', adminUserRouter);
