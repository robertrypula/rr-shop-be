import { Category } from '../../../entity/category';
import { getSlugFromPolishString } from '../../../utils/name.utils';
import { removeMultipleWhitespaceCharacters } from '../../../utils/transformation.utils';
import { AdminCategoryWriteRequestBody } from '../../rest-api/category.models';
import { AdminCategoryRepositoryService } from './admin-category-repository.service';

export class AdminCategoryService {
  public constructor(
    protected adminCategoryRepositoryService: AdminCategoryRepositoryService = new AdminCategoryRepositoryService()
  ) {}

  public async create(body: AdminCategoryWriteRequestBody): Promise<Category> {
    const category: Category = new Category();
    const newParentCategory: Category = body.parentId
      ? await this.adminCategoryRepositoryService.getAdminFullCategoryWithParent(body.parentId)
      : null;

    this.fillCategory(category, body);
    category.parent = newParentCategory;

    return await this.adminCategoryRepositoryService.save(category);
  }

  public async getAdminCategory(id: number): Promise<Category> {
    return await this.adminCategoryRepositoryService.getAdminCategory(id);
  }

  public async getAdminCategories(): Promise<Category[]> {
    return await this.adminCategoryRepositoryService.getAdminCategories();
  }

  public async patch(id: number, body: AdminCategoryWriteRequestBody): Promise<void> {
    const category: Category = await this.adminCategoryRepositoryService.getAdminFullCategoryWithParent(id);
    const newParentCategory: Category = body.parentId
      ? await this.adminCategoryRepositoryService.getAdminFullCategoryWithParent(body.parentId)
      : null;

    this.fillCategory(category, body);
    category.parent = newParentCategory;

    await this.adminCategoryRepositoryService.save(category);
  }

  protected fillCategory(category: Category, body: AdminCategoryWriteRequestBody): void {
    category.name = removeMultipleWhitespaceCharacters(body.name).trim();
    category.slug = getSlugFromPolishString(category.name);
    category.content = body.content ? body.content.replace(/\r/g, '').trim() : null;
    category.isHidden = body.isHidden;
    category.isNotClickable = body.isNotClickable;
    category.isWithoutProducts = body.isWithoutProducts;
  }
}
