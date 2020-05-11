import * as bodyParser from 'body-parser';
import { Request, Response, Router } from 'express';

import { AdminDistributorController } from '../../admin/controllers/admin-distributor-controller';

export const adminDistributorRouter = Router();

const jsonBodyParser = bodyParser.json();
const execute = (action: keyof AdminDistributorController) => (req: Request, res: Response): Promise<void> | void =>
  new AdminDistributorController()[action](req, res);

adminDistributorRouter.get('/', execute('getDistributors'));
adminDistributorRouter.get('/:id([0-9]+)', execute('getDistributor'));
adminDistributorRouter.patch('/:id([0-9]+)', jsonBodyParser, execute('patchDistributor'));
adminDistributorRouter.post('/', jsonBodyParser, execute('createDistributor'));
