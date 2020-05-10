import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { Image } from '../../../entity/image';

export class AdminImageRepositoryService {
  public constructor(protected repository: Repository<Image> = getRepository(Image)) {}

  public async getAdminImage(id: number): Promise<Image> {
    const selectQueryBuilder: SelectQueryBuilder<Image> = this.repository
      .createQueryBuilder('image')
      .select(['image'])
      .where('image.id = :id', { id });

    return await selectQueryBuilder.getOne();
  }

  public async getAdminImages(): Promise<Image[]> {
    const selectQueryBuilder: SelectQueryBuilder<Image> = this.repository
      .createQueryBuilder('image')
      .select([
        'image',
        ...['id', 'name'].map(c => `category.${c}`),
        ...['id', 'name'].map(c => `manufacturer.${c}`),
        ...['id', 'name'].map(c => `product.${c}`)
      ])
      .leftJoin('image.category', 'category')
      .leftJoin('image.manufacturer', 'manufacturer')
      .leftJoin('image.product', 'product')
      .orderBy('image.id', 'ASC');

    return await selectQueryBuilder.getMany();
  }

  public async getAdminImageWithNoRelations(id: number): Promise<Image> {
    const selectQueryBuilder: SelectQueryBuilder<Image> = this.repository
      .createQueryBuilder('image')
      .select(['image'])
      .where('image.id = :id', { id });

    return await selectQueryBuilder.getOne();
  }

  public async save(image: Image): Promise<Image> {
    return await this.repository.save(image);
  }
}
