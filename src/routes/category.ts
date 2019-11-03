import { Request, Response, Router } from 'express';
import { CategoryController } from '../controllers/category-controller';

export const categoryRouter = Router();

const execute = (action: keyof CategoryController) => (req: Request, res: Response): Promise<void> | void =>
  new CategoryController()[action](req, res);

categoryRouter.get('/', execute('all'));
