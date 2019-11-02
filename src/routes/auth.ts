import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller';
import { checkJwt } from '../middlewares/check-jwt';

export const authRouter = Router();

authRouter.post('/login', AuthController.login);
authRouter.post('/change-password', [checkJwt], AuthController.changePassword);
