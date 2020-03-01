import * as bodyParser from 'body-parser';
import { NextFunction, Request, Response, Router } from 'express';

import { PayUController } from '../controllers/pay-u-controller';

export const payURouter = Router();

const defaultContentTypeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.headers['content-type'] = req.headers['content-type'] || 'default/content-type';
  next();
};

const textBodyParser = bodyParser.text({ type: '*/*' });
const execute = (action: keyof PayUController) => (req: Request, res: Response): Promise<void> | void =>
  new PayUController()[action](req, res);

payURouter.get('/create-order', execute('createOrder'));
payURouter.post('/notify', defaultContentTypeMiddleware, textBodyParser, execute('notify'));
