import { Category } from '../../../entity/category';
import { Product } from '../../../entity/product';
import { ProductService } from '../../../services/product/product.service';
import { getCashRegisterName, getSlugFromPolishString } from '../../../utils/name.utils';
import {
  cleanMultiLineTextBeforeStoringInDb,
  cleanSingleLineAllowSingleSpaceTextBeforeStoringInDb
} from '../../../utils/transformation.utils';
import { AdminProductWriteRequestBody } from '../../rest-api/product.models';
import { AdminCategoryRepositoryService } from '../category/admin-category-repository.service';
import { AdminDistributorRepositoryService } from '../distributor/admin-distributor-repository.service';
import { AdminManufacturerRepositoryService } from '../manufacturer/admin-manufacturer-repository.service';
import { AdminProductRepositoryService } from './admin-product-repository.service';

// TODO check why Prettier can't format longer lines
// tslint:disable:max-line-length
export class AdminProductService {
  public constructor(
    protected adminCategoryRepositoryService: AdminCategoryRepositoryService = new AdminCategoryRepositoryService(),
    protected adminDistributorRepositoryService: AdminDistributorRepositoryService = new AdminDistributorRepositoryService(),
    protected adminManufacturerRepositoryService: AdminManufacturerRepositoryService = new AdminManufacturerRepositoryService(),
    protected adminProductRepositoryService: AdminProductRepositoryService = new AdminProductRepositoryService(),
    protected productService: ProductService = new ProductService()
  ) {}

  public async create(body: AdminProductWriteRequestBody): Promise<Product> {
    const product: Product = new Product();

    await this.fill(product, body);
    await this.adminProductRepositoryService.save(product);
    product.externalId = product.id; // TODO potential issues when it will get out of sync
    await this.adminProductRepositoryService.save(product);

    return product;
  }

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
    product.nameCashRegister = body.nameCashRegister ? body.nameCashRegister : getCashRegisterName(product.name);
    product.description = body.description ? cleanMultiLineTextBeforeStoringInDb(body.description) : null;
    product.descriptionDelivery = body.descriptionDelivery
      ? cleanMultiLineTextBeforeStoringInDb(body.descriptionDelivery)
      : null;
    product.priceUnit = body.priceUnit;
    product.priceUnitBeforePromotion = body.priceUnitBeforePromotion ? body.priceUnitBeforePromotion : null;
    product.notes = body.notes ? cleanMultiLineTextBeforeStoringInDb(body.notes) : null;
    product.isDeliveryOnlyOwn = body.isDeliveryOnlyOwn;
    product.isHidden = body.isHidden;
    product.tags = body.tags;

    product.distributor = body.distributorId
      ? await this.adminDistributorRepositoryService.getAdminDistributorWithNoRelations(body.distributorId)
      : null;

    product.manufacturer = body.manufacturerId
      ? await this.adminManufacturerRepositoryService.getAdminManufacturerWithNoRelations(body.manufacturerId)
      : null;

    if (body.nameCashRegister && body.nameCashRegister !== getCashRegisterName(body.nameCashRegister)) {
      throw `Wrong format in cash register field`;
    }

    product.categories =
      body.categoryIds && body.categoryIds.length
        ? await this.adminCategoryRepositoryService.getAdminCategoriesWithNoRelations(body.categoryIds)
        : [];
  }
}
