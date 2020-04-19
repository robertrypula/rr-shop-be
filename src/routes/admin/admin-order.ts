import * as bodyParser from 'body-parser';
import { Request, Response, Router } from 'express';

import { AdminOrderController } from '../../controllers/admin/admin-order-controller';

export const adminOrderRouter = Router();

const jsonBodyParser = bodyParser.json();
const execute = (action: keyof AdminOrderController) => (req: Request, res: Response): Promise<void> | void =>
  new AdminOrderController()[action](req, res);

adminOrderRouter.get('/:id([0-9]+)', execute('getOrder'));
adminOrderRouter.patch('/:id([0-9]+)', jsonBodyParser, execute('patchStatus'));
adminOrderRouter.get('/', execute('getOrders'));
