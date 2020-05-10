import { Image } from '../../../entity/image';
import { cleanSingleLineNoWhiteSpacesTextBeforeStoringInDb } from '../../../utils/transformation.utils';
import { AdminImageWriteRequestBody } from '../../rest-api/image.models';
import { AdminCategoryRepositoryService } from '../category/admin-category-repository.service';
import { AdminManufacturerRepositoryService } from '../manufacturer/admin-manufacturer-repository.service';
import { AdminProductRepositoryService } from '../product/admin-product-repository.service';
import { AdminImageRepositoryService } from './admin-image-repository.service';

// TODO check why prettier can't format long lines
// tslint:disable:max-line-length
export class AdminImageService {
  public constructor(
    protected adminCategoryRepositoryService: AdminCategoryRepositoryService = new AdminCategoryRepositoryService(),
    protected adminImageRepositoryService: AdminImageRepositoryService = new AdminImageRepositoryService(),
    protected adminManufacturerRepositoryService: AdminManufacturerRepositoryService = new AdminManufacturerRepositoryService(),
    protected adminProductRepositoryService: AdminProductRepositoryService = new AdminProductRepositoryService()
  ) {}

  public async create(body: AdminImageWriteRequestBody): Promise<Image> {
    const image: Image = new Image();

    await this.fill(image, body);

    return await this.adminImageRepositoryService.save(image);
  }

  public async getAdminImage(id: number): Promise<Image> {
    return await this.adminImageRepositoryService.getAdminImage(id);
  }

  public async getAdminImages(): Promise<Image[]> {
    return await this.adminImageRepositoryService.getAdminImages();
  }

  public async patch(id: number, body: AdminImageWriteRequestBody): Promise<void> {
    const image: Image = await this.adminImageRepositoryService.getAdminImageWithNoRelations(id);

    await this.fill(image, body);

    await this.adminImageRepositoryService.save(image);
  }

  protected async fill(image: Image, body: AdminImageWriteRequestBody): Promise<void> {
    image.filename = body.filename ? cleanSingleLineNoWhiteSpacesTextBeforeStoringInDb(body.filename) : null;
    image.sortOrder = body.sortOrder;

    image.category = body.categoryId
      ? await this.adminCategoryRepositoryService.getAdminCategoryWithNoRelations(body.categoryId)
      : null;
    image.product = body.productId
      ? await this.adminProductRepositoryService.getAdminProductWithNoRelations(body.productId)
      : null;
    image.manufacturer = body.manufacturerId
      ? await this.adminManufacturerRepositoryService.getAdminManufacturerWithNoRelations(body.manufacturerId)
      : null;
  }
}
