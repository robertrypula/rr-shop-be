import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { OrderItem } from '../../entity/order-item';

export class OrderItemRepositoryService {
  public constructor(protected repository: Repository<OrderItem> = getRepository(OrderItem)) {}

  public async getAdminOrderItem(orderItemId: number): Promise<OrderItem> {
    const selectQueryBuilder: SelectQueryBuilder<OrderItem> = this.repository
      .createQueryBuilder('orderItem')
      .select([...['id', 'productId', 'quantity'].map(c => `orderItem.${c}`)])
      .where('orderItem.id = :orderItemId', { orderItemId });

    return await selectQueryBuilder.getOne();
  }

  public async save(orderItem: OrderItem): Promise<OrderItem> {
    return await this.repository.save(orderItem);
  }
}
