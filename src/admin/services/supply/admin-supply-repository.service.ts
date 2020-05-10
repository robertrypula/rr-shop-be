import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { Supply } from '../../../entity/supply';

export class AdminSupplyRepositoryService {
  public constructor(protected repository: Repository<Supply> = getRepository(Supply)) {}

  public async getAdminSupply(id: number): Promise<Supply> {
    const selectQueryBuilder: SelectQueryBuilder<Supply> = this.repository
      .createQueryBuilder('supply')
      .select(['supply'])
      .where('supply.id = :id', { id });

    return await selectQueryBuilder.getOne();
  }

  public async getAdminSupplies(): Promise<Supply[]> {
    const selectQueryBuilder: SelectQueryBuilder<Supply> = this.repository
      .createQueryBuilder('supply')
      .select(['supply'])
      .orderBy('supply.id', 'ASC');

    return await selectQueryBuilder.getMany();
  }

  public async getAdminSupplyWithNoRelations(id: number): Promise<Supply> {
    const selectQueryBuilder: SelectQueryBuilder<Supply> = this.repository
      .createQueryBuilder('supply')
      .select(['supply'])
      .where('supply.id = :id', { id });

    return await selectQueryBuilder.getOne();
  }

  public async save(supply: Supply): Promise<Supply> {
    return await this.repository.save(supply);
  }
}
