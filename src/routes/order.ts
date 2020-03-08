import { Request, Response, Router } from 'express';
import { CategoryController } from '../controllers/order-controller';

export const orderRouter = Router();

const execute = (action: keyof CategoryController) => (req: Request, res: Response): Promise<void> | void =>
  new CategoryController()[action](req, res);

orderRouter.post('/', execute('create'));
