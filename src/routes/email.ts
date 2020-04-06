import * as bodyParser from 'body-parser';
import { Request, Response, Router } from 'express';

import { EmailController } from '../controllers/email-controller';

export const emailRouter = Router();

const jsonBodyParser = bodyParser.json();
const execute = (action: keyof EmailController) => (req: Request, res: Response): Promise<void> | void =>
  new EmailController()[action](req, res);

emailRouter.patch('/', jsonBodyParser, execute('patchIsSend'));
