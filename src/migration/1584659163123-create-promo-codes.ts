import { MigrationInterface, QueryRunner } from 'typeorm';

import { PromoCode } from '../entity/promo-code';

export class CreatePromoCodes1584659163123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const promoCode: PromoCode = new PromoCode();

    promoCode.percentageDiscount = 20;
    promoCode.name = 'RABAT-20';
    promoCode.isActive = true;

    await queryRunner.manager.save(promoCode);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // empty
  }
}
