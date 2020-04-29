import { Product } from '../../../entity/product';
import { getSlugFromPolishString } from '../../../utils/name.utils';
import { AdminProductPatch } from '../../rest-api/product.models';
import { AdminProductRepositoryService } from './admin-product-repository.service';

export class AdminProductService {
  public constructor(
    protected adminProductRepositoryService: AdminProductRepositoryService = new AdminProductRepositoryService()
  ) {}

  public async patch(id: number, body: AdminProductPatch): Promise<void> {
    const product: Product = await this.adminProductRepositoryService.getAdminPureProduct(id);

    product.name = body.name;
    product.slug = getSlugFromPolishString(product.name);
    product.description = body.description;
    product.priceUnit = body.priceUnit;
    product.notes = body.notes;
    product.isHidden = body.isHidden;

    await this.adminProductRepositoryService.save(product);
  }
}
