import { getRepository, Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

import { Product } from '../entity/product';

export class ProductService {
  public constructor(protected repository: Repository<Product> = getRepository(Product)) {}

  public async getSuppliesCount(productIds: number[]): Promise<Array<{ productId: number; suppliesCount: number }>> {
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select('product.id', 'productId')
      .addSelect('COUNT(supplies.id)', 'suppliesCount')
      .leftJoin('product.supplies', 'supplies')
      .groupBy('product.id');

    productIds !== null && queryBuilder.where('product.id IN (:...productIds)', { productIds });

    return await queryBuilder.getRawMany();
  }
}
