import { Category } from '../../entity/category';
import { CategoryRepositoryService } from './category-repository.service';

export class CategoryService {
  public constructor(
    protected categoryRepositoryService: CategoryRepositoryService = new CategoryRepositoryService()
  ) {}

  public async getCategories(): Promise<Category[]> {
    return await this.categoryRepositoryService.getCategories();
  }
}
