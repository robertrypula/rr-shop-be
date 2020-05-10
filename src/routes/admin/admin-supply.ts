import * as bodyParser from 'body-parser';
import { Request, Response, Router } from 'express';

import { AdminSupplyController } from '../../admin/controllers/admin-supply-controller';

export const adminSupplyRouter = Router();

const jsonBodyParser = bodyParser.json();
const execute = (action: keyof AdminSupplyController) => (req: Request, res: Response): Promise<void> | void =>
  new AdminSupplyController()[action](req, res);

adminSupplyRouter.get('/', execute('getMany'));
adminSupplyRouter.get('/:id([0-9]+)', execute('getOne'));
adminSupplyRouter.patch('/:id([0-9]+)/orderItemId', jsonBodyParser, execute('patchOrderItemId'));
adminSupplyRouter.patch('/:id([0-9]+)', jsonBodyParser, execute('patch'));
adminSupplyRouter.post('/', jsonBodyParser, execute('create'));
