import { Request, Response, Router } from 'express';

import * as bodyParser from 'body-parser';
import { PayUController } from '../controllers/pay-u-controller';

export const payURouter = Router();

const execute = (action: keyof PayUController) => (req: Request, res: Response): Promise<void> | void =>
  new PayUController()[action](req, res);

payURouter.get('/create-order', execute('createOrder'));
payURouter.post('/notify', bodyParser.text({ type: '*/*' }), execute('notify'));
