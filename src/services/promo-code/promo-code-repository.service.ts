import { getRepository, Repository } from 'typeorm';

import { PromoCode } from '../../entity/promo-code';

export class PromoCodeRepositoryService {
  public constructor(protected repository: Repository<PromoCode> = getRepository(PromoCode)) {}

  public async getActivePromoCode(name: string, includeId = false): Promise<PromoCode> {
    return await this.repository
      .createQueryBuilder('promoCode')
      .select([...(includeId ? ['id'] : []), 'name', 'percentageDiscount'].map(c => `promoCode.${c}`))
      .where('promoCode.isActive is true')
      .andWhere('promoCode.name = :name', { name })
      .getOne();
  }
}
