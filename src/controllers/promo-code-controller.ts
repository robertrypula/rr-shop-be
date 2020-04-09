import { Request, Response } from 'express';

import { PromoCode } from '../entity/promo-code';
import { PromoCodeRepositoryService } from '../services/promo-code/promo-code-repository.service';

export class PromoCodeController {
  public constructor(
    protected promoCodeRepositoryService: PromoCodeRepositoryService = new PromoCodeRepositoryService()
  ) {}

  public async getPromoCode(req: Request, res: Response): Promise<void> {
    try {
      const promoCode: PromoCode = await this.promoCodeRepositoryService.getActivePromoCode(this.getName(req));

      if (promoCode) {
        res.send(promoCode);
      } else {
        res.status(404).send();
      }
    } catch (error) {
      res.status(500).send({ errorMessage: `Error occurred when loading promo code: ${error}` });
    }
  }

  protected getName(req: Request): string {
    return req.query && req.query.name ? `${req.query.name}` : '';
  }
}
