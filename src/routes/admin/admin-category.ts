import * as bodyParser from 'body-parser';
import { Request, Response, Router } from 'express';

import { AdminCategoryController } from '../../admin/controllers/admin-category-controller';

export const adminCategoryRouter = Router();

const jsonBodyParser = bodyParser.json();
const execute = (action: keyof AdminCategoryController) => (req: Request, res: Response): Promise<void> | void =>
  new AdminCategoryController()[action](req, res);

adminCategoryRouter.get('/', execute('getCategories'));
adminCategoryRouter.get('/:id([0-9]+)', execute('getCategory'));
adminCategoryRouter.patch('/:id([0-9]+)', jsonBodyParser, execute('patchCategory'));
adminCategoryRouter.post('/', jsonBodyParser, execute('createCategory'));
