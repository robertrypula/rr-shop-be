import { Request, Response, Router } from 'express';
import { OrderController } from '../controllers/order-controller';

export const orderRouter = Router();

const execute = (action: keyof OrderController) => (req: Request, res: Response): Promise<void> | void =>
  new OrderController()[action](req, res);

orderRouter.post('/', execute('create'));
