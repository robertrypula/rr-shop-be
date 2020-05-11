import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { Manufacturer } from '../../../entity/manufacturer';

export class AdminManufacturerRepositoryService {
  public constructor(protected repository: Repository<Manufacturer> = getRepository(Manufacturer)) {}

  public async getAdminManufacturer(id: number): Promise<Manufacturer> {
    const selectQueryBuilder: SelectQueryBuilder<Manufacturer> = this.repository
      .createQueryBuilder('manufacturer')
      .select(['manufacturer'])
      .where('manufacturer.id = :id', { id });

    return await selectQueryBuilder.getOne();
  }

  public async getAdminManufacturers(): Promise<Manufacturer[]> {
    const selectQueryBuilder: SelectQueryBuilder<Manufacturer> = this.repository
      .createQueryBuilder('manufacturer')
      .select(['manufacturer'])
      .orderBy('manufacturer.name', 'ASC');

    return await selectQueryBuilder.getMany();
  }

  public async getAdminManufacturerWithNoRelations(id: number): Promise<Manufacturer> {
    const selectQueryBuilder: SelectQueryBuilder<Manufacturer> = this.repository
      .createQueryBuilder('manufacturer')
      .select(['manufacturer'])
      .where('manufacturer.id = :id', { id });

    return await selectQueryBuilder.getOne();
  }

  public async save(manufacturer: Manufacturer): Promise<Manufacturer> {
    return await this.repository.save(manufacturer);
  }
}
