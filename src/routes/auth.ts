import { Request, Response, Router } from 'express';

import { AuthController } from '../controllers/auth-controller';
import { checkJwt } from '../middlewares/check-jwt';

export const authRouter = Router();

const execute = (action: keyof AuthController) => (req: Request, res: Response): Promise<void> =>
  new AuthController()[action](req, res);

authRouter.post('/login', execute('login'));
authRouter.post('/change-password', [checkJwt], execute('changePassword'));
