import { Router } from 'express';

import { adminOrderRouter } from './admin-order';
import { adminProductRouter } from './admin-product';
import { adminSupplyRouter } from './admin-supply';
import { adminUserRouter } from './admin-user';

export const adminRoutes = Router();

adminRoutes.use('/order', adminOrderRouter);
adminRoutes.use('/product', adminProductRouter);
adminRoutes.use('/supply', adminSupplyRouter);
adminRoutes.use('/user', adminUserRouter);
