import { Category } from '../../../entity/category';
import { getSlugFromPolishString } from '../../../utils/name.utils';
import { AdminCategoryPatch } from '../../rest-api/category.models';
import { AdminCategoryRepositoryService } from './admin-category-repository.service';

export class AdminCategoryService {
  public constructor(
    protected adminCategoryRepositoryService: AdminCategoryRepositoryService = new AdminCategoryRepositoryService()
  ) {}

  public async getAdminCategory(id: number): Promise<Category> {
    return await this.adminCategoryRepositoryService.getAdminCategory(id);
  }

  public async getAdminCategories(): Promise<Category[]> {
    return await this.adminCategoryRepositoryService.getAdminCategories();
  }

  public async patch(id: number, body: AdminCategoryPatch): Promise<void> {
    const category: Category = await this.adminCategoryRepositoryService.getAdminFullCategoryWithoutRelations(id);

    category.name = body.name;
    category.slug = getSlugFromPolishString(category.name);
    category.isHidden = body.isHidden;

    // TODO implement more

    await this.adminCategoryRepositoryService.save(category);
  }
}
