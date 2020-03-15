import * as bodyParser from 'body-parser';
import { Request, Response, Router } from 'express';

import { AdminUserController } from '../../controllers/admin/admin-user-controller';

export const adminUserRouter = Router();

const jsonBodyParser = bodyParser.json();
const execute = (action: keyof AdminUserController) => (req: Request, res: Response): Promise<void> | void =>
  new AdminUserController()[action](req, res);

adminUserRouter.get('/', execute('getUsers'));
adminUserRouter.get('/:id([0-9]+)', execute('getUser'));
adminUserRouter.delete('/:id([0-9]+)', execute('deleteUser'));
adminUserRouter.patch('/:id([0-9]+)', jsonBodyParser, execute('editUser'));
adminUserRouter.post('/', jsonBodyParser, execute('createUser'));
