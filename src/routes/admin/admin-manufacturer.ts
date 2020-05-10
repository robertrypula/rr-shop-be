import * as bodyParser from 'body-parser';
import { Request, Response, Router } from 'express';

import { AdminManufacturerController } from '../../admin/controllers/admin-manufacturer-controller';

export const adminManufacturerRouter = Router();

const jsonBodyParser = bodyParser.json();
const execute = (action: keyof AdminManufacturerController) => (req: Request, res: Response): Promise<void> | void =>
  new AdminManufacturerController()[action](req, res);

adminManufacturerRouter.get('/', execute('getManufacturers'));
adminManufacturerRouter.get('/:id([0-9]+)', execute('getManufacturer'));
adminManufacturerRouter.patch('/:id([0-9]+)', jsonBodyParser, execute('patchManufacturer'));
adminManufacturerRouter.post('/', jsonBodyParser, execute('createManufacturer'));
