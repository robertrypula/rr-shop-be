import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { Distributor } from '../../../entity/distributor';

export class AdminDistributorRepositoryService {
  public constructor(protected repository: Repository<Distributor> = getRepository(Distributor)) {}

  public async getAdminDistributor(id: number): Promise<Distributor> {
    const selectQueryBuilder: SelectQueryBuilder<Distributor> = this.repository
      .createQueryBuilder('distributor')
      .select(['distributor'])
      .where('distributor.id = :id', { id });

    return await selectQueryBuilder.getOne();
  }

  public async getAdminDistributors(): Promise<Distributor[]> {
    const selectQueryBuilder: SelectQueryBuilder<Distributor> = this.repository
      .createQueryBuilder('distributor')
      .select(['distributor'])
      .orderBy('distributor.name', 'ASC');

    return await selectQueryBuilder.getMany();
  }

  public async getAdminDistributorWithNoRelations(id: number): Promise<Distributor> {
    const selectQueryBuilder: SelectQueryBuilder<Distributor> = this.repository
      .createQueryBuilder('distributor')
      .select(['distributor'])
      .where('distributor.id = :id', { id });

    return await selectQueryBuilder.getOne();
  }

  public async save(distributor: Distributor): Promise<Distributor> {
    return await this.repository.save(distributor);
  }
}
