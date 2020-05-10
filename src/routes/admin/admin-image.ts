import * as bodyParser from 'body-parser';
import { Request, Response, Router } from 'express';

import { AdminImageController } from '../../admin/controllers/admin-image-controller';

export const adminImageRouter = Router();

const jsonBodyParser = bodyParser.json();
const execute = (action: keyof AdminImageController) => (req: Request, res: Response): Promise<void> | void =>
  new AdminImageController()[action](req, res);

adminImageRouter.get('/', execute('getImages'));
adminImageRouter.get('/:id([0-9]+)', execute('getImage'));
adminImageRouter.patch('/:id([0-9]+)', jsonBodyParser, execute('patchImage'));
adminImageRouter.post('/', jsonBodyParser, execute('createImage'));
