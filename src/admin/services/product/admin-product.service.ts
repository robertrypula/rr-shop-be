import { Product } from '../../../entity/product';
import { ProductService } from '../../../services/product/product.service';
import { getSlugFromPolishString } from '../../../utils/name.utils';
import {
  cleanMultiLineTextBeforeStoringInDb,
  cleanSingleLineAllowSingleSpaceTextBeforeStoringInDb
} from '../../../utils/transformation.utils';
import { AdminProductWriteRequestBody } from '../../rest-api/product.models';
import { AdminProductRepositoryService } from './admin-product-repository.service';

export class AdminProductService {
  public constructor(
    protected adminProductRepositoryService: AdminProductRepositoryService = new AdminProductRepositoryService(),
    protected productService: ProductService = new ProductService()
  ) {}

  public async getAdminProduct(id: number): Promise<Product> {
    return await this.adminProductRepositoryService.getAdminProduct(id);
  }

  public async getAdminProducts(): Promise<Product[]> {
    const products: Product[] = await this.adminProductRepositoryService.getAdminProducts();

    await this.productService.attachOrderItemsStubs(products, null);
    await this.productService.attachSuppliesStubs(products, null);

    return this.productService.triggerCalculations(products, false);
  }

  public async patch(id: number, body: AdminProductWriteRequestBody): Promise<void> {
    const product: Product = await this.adminProductRepositoryService.getAdminProductWithNoRelations(id);

    await this.fill(product, body);

    await this.adminProductRepositoryService.save(product);
  }

  public async fill(product: Product, body: AdminProductWriteRequestBody): Promise<void> {
    product.name = body.name ? cleanSingleLineAllowSingleSpaceTextBeforeStoringInDb(body.name) : null;
    product.slug = product.name ? getSlugFromPolishString(product.name) : null;
    product.description = body.description ? cleanMultiLineTextBeforeStoringInDb(body.description) : null;
    product.priceUnit = body.priceUnit;
    product.notes = body.notes;
    product.isHidden = body.isHidden;
  }
}
