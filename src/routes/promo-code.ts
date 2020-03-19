import { Request, Response, Router } from 'express';

import { PromoCodeController } from '../controllers/promo-code-controller';

export const promoCodeRouter = Router();

const execute = (action: keyof PromoCodeController) => (req: Request, res: Response): Promise<void> | void =>
  new PromoCodeController()[action](req, res);

promoCodeRouter.get('/', execute('getPromoCode'));
