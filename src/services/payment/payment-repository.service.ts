import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { Payment } from '../../entity/payment';

export class PaymentRepositoryService {
  public constructor(protected repository: Repository<Payment> = getRepository(Payment)) {}

  public async getPaymentWithFullOrder(paymentExternalId: string, orderNumber: string): Promise<Payment> {
    const selectQueryBuilder: SelectQueryBuilder<Payment> = this.repository
      .createQueryBuilder('payment')
      .select(['payment', 'order', 'orderItems', 'promoCode'])
      .leftJoin('payment.order', 'order')
      .leftJoin('order.orderItems', 'orderItems')
      .leftJoin('order.promoCode', 'promoCode')
      .where('payment.externalId = :paymentExternalId', { paymentExternalId })
      .andWhere('order.number = :orderNumber', { orderNumber });

    return await selectQueryBuilder.getOne();
  }

  public async save(payment: Payment): Promise<Payment> {
    return await this.repository.save(payment);
  }
}
