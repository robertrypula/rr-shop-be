import * as bodyParser from 'body-parser';
import { Request, Response, Router } from 'express';

import { UserController } from '../controllers/user-controller';
import { checkJwt } from '../middlewares/check-jwt';
import { checkRole } from '../middlewares/check-role';

export const userRouter = Router();

const jsonBodyParser = bodyParser.json();
const jwtAdmin = [checkJwt, checkRole(['ADMIN'])];
const execute = (action: keyof UserController) => (req: Request, res: Response): Promise<void> | void =>
  new UserController()[action](req, res);

userRouter.get('/', jwtAdmin, execute('getUsers'));
userRouter.get('/:id([0-9]+)', jwtAdmin, execute('getUser'));
userRouter.delete('/:id([0-9]+)', jwtAdmin, execute('deleteUser'));
userRouter.patch('/:id([0-9]+)', jsonBodyParser, jwtAdmin, execute('editUser'));
userRouter.post('/', jsonBodyParser, jwtAdmin, execute('newUser'));
