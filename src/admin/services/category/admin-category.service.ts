import { Category } from '../../../entity/category';
import { getSlugFromPolishString } from '../../../utils/name.utils';
import {
  cleanMultiLineTextBeforeStoringInDb,
  cleanSingleLineAllowSingleSpaceTextBeforeStoringInDb
} from '../../../utils/transformation.utils';
import { AdminCategoryWriteRequestBody } from '../../rest-api/category.models';
import { AdminCategoryRepositoryService } from './admin-category-repository.service';

export class AdminCategoryService {
  public constructor(
    protected adminCategoryRepositoryService: AdminCategoryRepositoryService = new AdminCategoryRepositoryService()
  ) {}

  public async create(body: AdminCategoryWriteRequestBody): Promise<Category> {
    const category: Category = new Category();

    await this.fill(category, body);

    return await this.adminCategoryRepositoryService.save(category);
  }

  public async getAdminCategory(id: number): Promise<Category> {
    return await this.adminCategoryRepositoryService.getAdminCategory(id);
  }

  public async getAdminCategories(): Promise<Category[]> {
    return await this.adminCategoryRepositoryService.getAdminCategories();
  }

  public async patch(id: number, body: AdminCategoryWriteRequestBody): Promise<void> {
    const category: Category = await this.adminCategoryRepositoryService.getAdminCategoryWithNoRelations(id);

    await this.fill(category, body);
    await this.adminCategoryRepositoryService.save(category);
  }

  protected async fill(category: Category, body: AdminCategoryWriteRequestBody): Promise<void> {
    category.name = body.name ? cleanSingleLineAllowSingleSpaceTextBeforeStoringInDb(body.name) : null;
    category.slug = category.name ? getSlugFromPolishString(category.name) : null;
    category.content = body.content ? cleanMultiLineTextBeforeStoringInDb(body.content) : null;
    category.isHidden = body.isHidden;
    category.isNotClickable = body.isNotClickable;
    category.isWithoutProducts = body.isWithoutProducts;

    category.parent = body.parentId
      ? await this.adminCategoryRepositoryService.getAdminCategoryWithNoRelations(body.parentId)
      : null;
  }
}
