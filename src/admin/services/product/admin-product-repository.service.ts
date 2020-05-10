import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { Product } from '../../../entity/product';

export class AdminProductRepositoryService {
  public constructor(protected repository: Repository<Product> = getRepository(Product)) {}

  public async getAdminProduct(id: number): Promise<Product> {
    const selectQueryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select([
        'product',
        'orderItems',
        ...['order.number', 'order.status'],
        ...['orderItemsSupplies.bestBefore'],
        'productSupplies',
        'productSuppliesOrderItem.priceUnitSelling',
        ...['productSuppliesOrderItemOrder.number', 'productSuppliesOrderItemOrder.status'],
        'distributor',
        'manufacturer'
      ])
      .leftJoin('product.orderItems', 'orderItems')
      .leftJoin('orderItems.order', 'order')
      .leftJoin('orderItems.supplies', 'orderItemsSupplies')
      .leftJoin('product.supplies', 'productSupplies')
      .leftJoin('productSupplies.orderItem', 'productSuppliesOrderItem')
      .leftJoin('productSuppliesOrderItem.order', 'productSuppliesOrderItemOrder')
      .leftJoin('product.distributor', 'distributor')
      .leftJoin('product.manufacturer', 'manufacturer')
      .where('product.id = :id', { id });

    return await selectQueryBuilder.getOne();
  }

  public async getAdminProducts(): Promise<Product[]> {
    const selectQueryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select([
        ...['id', 'externalId', 'name', 'nameCashRegister', 'priceUnit', 'isHidden', 'type'].map(c => `product.${c}`),
        'manufacturer.name'
      ])
      // .leftJoin('product.distributor', 'distributor')
      .leftJoin('product.manufacturer', 'manufacturer')
      // .where('product.type = :type', { type: Type.Product })
      .orderBy('product.externalId', 'ASC');

    return await selectQueryBuilder.getMany();
  }

  public async getAdminProductWithNoRelations(id: number): Promise<Product> {
    const selectQueryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select(['product'])
      .where('product.id = :id', { id });

    return await selectQueryBuilder.getOne();
  }

  public async save(product: Product): Promise<Product> {
    return await this.repository.save(product);
  }
}
