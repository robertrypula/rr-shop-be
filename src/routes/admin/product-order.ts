import { Request, Response, Router } from 'express';

import { AdminProductController } from '../../controllers/admin/admin-product-controller';

export const adminProductRouter = Router();

const execute = (action: keyof AdminProductController) => (req: Request, res: Response): Promise<void> | void =>
  new AdminProductController()[action](req, res);

adminProductRouter.get('/:id([0-9]+)', execute('getProduct'));
adminProductRouter.get('/', execute('getProducts'));
