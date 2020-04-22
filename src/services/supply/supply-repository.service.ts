import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { Supply } from '../../entity/supply';

export class SupplyRepositoryService {
  public constructor(protected repository: Repository<Supply> = getRepository(Supply)) {}

  public async getAdminSupply(supplyId: number): Promise<Supply> {
    const selectQueryBuilder: SelectQueryBuilder<Supply> = this.repository
      .createQueryBuilder('supply')
      .select([
        ...['id', 'productId', 'isUnavailable', 'orderItemId'].map(c => `supply.${c}`),
        ...['id'].map(c => `supplyProduct.${c}`),
        ...['id', 'productId', 'isUnavailable', 'orderItemId'].map(c => `supplyProductSupplies.${c}`)
      ])
      .leftJoin('supply.product', 'supplyProduct')
      .leftJoin('supplyProduct.supplies', 'supplyProductSupplies')
      .where('supply.id = :supplyId', { supplyId });

    return await selectQueryBuilder.getOne();
  }

  public async save(supply: Supply): Promise<Supply> {
    return await this.repository.save(supply);
  }
}
