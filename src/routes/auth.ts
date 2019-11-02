import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller';
import { checkJwt } from '../middlewares/check-jwt';

export const authRouter = Router();
//Login route
authRouter.post('/login', AuthController.login);

//Change my password
authRouter.post('/change-password', [checkJwt], AuthController.changePassword);
