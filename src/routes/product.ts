import { Request, Response, Router } from 'express';

import { ProductController } from '../controllers/product-controller';

export const productRouter = Router();

const execute = (action: keyof ProductController) => (req: Request, res: Response): Promise<void> | void =>
  new ProductController()[action](req, res);

productRouter.get('/', execute('getProducts'));
productRouter.get('/:id([0-9]+)', execute('getProduct'));
