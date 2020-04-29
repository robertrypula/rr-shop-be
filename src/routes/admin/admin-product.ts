import * as bodyParser from 'body-parser';
import { Request, Response, Router } from 'express';

import { AdminProductController } from '../../admin/controllers/admin-product-controller';

export const adminProductRouter = Router();

const jsonBodyParser = bodyParser.json();
const execute = (action: keyof AdminProductController) => (req: Request, res: Response): Promise<void> | void =>
  new AdminProductController()[action](req, res);

adminProductRouter.get('/', execute('getProducts'));
adminProductRouter.get('/:id([0-9]+)', execute('getProduct'));
adminProductRouter.patch('/:id([0-9]+)', jsonBodyParser, execute('patchProduct'));
