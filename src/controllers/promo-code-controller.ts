import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';

import { PromoCode } from '../entity/promo-code';

export class PromoCodeController {
  public constructor(protected repository: Repository<PromoCode> = getRepository(PromoCode)) {}

  public async getPromoCode(req: Request, res: Response): Promise<void> {
    try {
      res.send(
        await this.repository.findOneOrFail({
          select: ['name', 'percentageDiscount'],
          where: { name: req.query.name, isActive: true }
        })
      );
    } catch (error) {
      res.status(404).send({ errorMessage: 'Promo code not found' });
    }
  }
}
