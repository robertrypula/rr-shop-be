import { getRepository, Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

import { Order } from '../../entity/order';

export class OrderRepositoryService {
  public constructor(protected repository: Repository<Order> = getRepository(Order)) {}

  public async getOrder(uuid: string): Promise<Order> {
    const selectQueryBuilder: SelectQueryBuilder<Order> = this.repository
      .createQueryBuilder('order')
      .select([
        ...['uuid', 'number', 'status'].map(c => `order.${c}`),
        ...['name', 'priceUnitSelling', 'priceUnitOriginal', 'quantity', 'type', 'productId'].map(
          c => `orderItems.${c}`
        )
      ])
      .leftJoin('order.orderItems', 'orderItems')
      .where('order.uuid = :uuid', { uuid });

    return await selectQueryBuilder.getOne();
  }

  public async save(order: Order): Promise<Order> {
    return await this.repository.save(order);
  }
}
