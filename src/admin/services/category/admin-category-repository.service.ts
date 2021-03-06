import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { Category } from '../../../entity/category';

export class AdminCategoryRepositoryService {
  public constructor(protected repository: Repository<Category> = getRepository(Category)) {}

  public async getAdminCategory(id: number): Promise<Category> {
    const selectQueryBuilder: SelectQueryBuilder<Category> = this.repository
      .createQueryBuilder('category')
      .select(['category', 'parent'])
      .leftJoin('category.parent', 'parent')
      .where('category.id = :id', { id });

    return await selectQueryBuilder.getOne();
  }

  public async getAdminCategories(): Promise<Category[]> {
    const selectQueryBuilder: SelectQueryBuilder<Category> = this.repository
      .createQueryBuilder('category')
      .select([
        ...['id', 'name', 'structuralNode', 'sortOrder', 'isNotClickable', 'isHiddenListOfProducts', 'isHidden'].map(
          c => `category.${c}`
        ),
        ...['id', 'name'].map(c => `parent.${c}`)
      ])
      .leftJoin('category.parent', 'parent')
      .orderBy('category.id', 'ASC');

    return await selectQueryBuilder.getMany();
  }

  public async getAdminCategoriesWithNoRelations(categoryIds: number[]): Promise<Category[]> {
    const selectQueryBuilder: SelectQueryBuilder<Category> = this.repository
      .createQueryBuilder('category')
      .select(['category'])
      .where('category.id IN (:...categoryIds)', { categoryIds });

    return await selectQueryBuilder.getMany();
  }

  public async getAdminCategoryWithNoRelations(id: number): Promise<Category> {
    const selectQueryBuilder: SelectQueryBuilder<Category> = this.repository
      .createQueryBuilder('category')
      .select(['category'])
      .where('category.id = :id', { id });

    return await selectQueryBuilder.getOne();
  }

  public async save(category: Category): Promise<Category> {
    return await this.repository.save(category);
  }
}
