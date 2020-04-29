import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { Product } from '../../../entity/product';

export class AdminProductRepositoryService {
  public constructor(protected repository: Repository<Product> = getRepository(Product)) {}

  // ---------------------------------------------------------------------------

  public async getAdminPureProduct(id: number): Promise<Product> {
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
