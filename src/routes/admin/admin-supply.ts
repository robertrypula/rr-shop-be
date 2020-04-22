import * as bodyParser from 'body-parser';
import { Request, Response, Router } from 'express';

import { AdminSupplyController } from '../../controllers/admin/admin-supply-controller';

export const adminSupplyRouter = Router();

const jsonBodyParser = bodyParser.json();
const execute = (action: keyof AdminSupplyController) => (req: Request, res: Response): Promise<void> | void =>
  new AdminSupplyController()[action](req, res);

adminSupplyRouter.patch('/:id([0-9]+)', jsonBodyParser, execute('patchOrderItemId'));
