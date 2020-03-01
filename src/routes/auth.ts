import * as bodyParser from 'body-parser';
import { Request, Response, Router } from 'express';

import { AuthController } from '../controllers/auth-controller';
import { checkJwt } from '../middlewares/check-jwt';

export const authRouter = Router();

const jsonBodyParser = bodyParser.json();
const execute = (action: keyof AuthController) => (req: Request, res: Response): Promise<void> | void =>
  new AuthController()[action](req, res);

authRouter.post('/login', jsonBodyParser, execute('login'));
authRouter.post('/change-password', jsonBodyParser, [checkJwt], execute('changePassword'));
