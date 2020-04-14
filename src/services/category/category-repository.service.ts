import { getRepository, Repository } from 'typeorm';
import { Category } from '../../entity/category';
import { StructuralNode } from '../../models/category.models';

export class CategoryRepositoryService {
  public constructor(protected repository: Repository<Category> = getRepository(Category)) {}

  public async getCategoriesByStructuralNode(structuralNode: StructuralNode): Promise<Category[]> {
    return await this.repository
      .createQueryBuilder('category')
      .select(['id', 'name', 'content'].map(c => `category.${c}`))
      .leftJoin('category.parent', 'parent')
      .where('parent.structuralNode = :structuralNode', { structuralNode })
      .getMany();
  }
}
