import { Product } from '../../entity/product';
import { Supply } from '../../entity/supply';
import { FetchType, ProductsOrderItems, ProductsSuppliesCount } from '../../models/product.models';
import { removeDuplicates } from '../../utils/transformation.utils';
import { ProductRepositoryService } from './product-repository.service';

export class ProductService {
  public constructor(protected productRepositoryService: ProductRepositoryService = new ProductRepositoryService()) {}

  public async attachOrderItemsStubs(products: Product[], productIds: number[]): Promise<void> {
    let productsOrderItems: ProductsOrderItems;

    productsOrderItems = await this.productRepositoryService.getProductsOrderItems(productIds);
    products.forEach((product: Product): void => {
      if (typeof productsOrderItems[product.id] !== 'undefined') {
        product.orderItems = productsOrderItems[product.id];
      }
    });
  }

  public async attachSuppliesStubs(products: Product[], productIds: number[]): Promise<void> {
    let productsSuppliesCount: ProductsSuppliesCount;

    productsSuppliesCount = await this.productRepositoryService.getProductsSuppliesCount(productIds, true);
    products.forEach((product: Product): void => {
      if (typeof productsSuppliesCount[product.id] !== 'undefined') {
        product.supplies = [];
        for (let i = 0; i < productsSuppliesCount[product.id]; i++) {
          product.supplies.push(new Supply());
        }
      }
    });
  }

  public async getAdminProduct(id: number): Promise<Product> {
    return await this.productRepositoryService.getAdminProduct(id);
  }

  public async getAdminProducts(): Promise<Product[]> {
    const products: Product[] = await this.productRepositoryService.getAdminProducts();

    // await this.attachOrderItemsStubs(products, null);
    // await this.attachSuppliesStubs(products, null);

    return this.triggerCalculations(products, false);
  }

  public async getProductsByFetchType(productIds: number[], fetchType: FetchType): Promise<Product[]> {
    if (productIds !== null) {
      productIds = removeDuplicates(productIds.map(i => i + '')).map(i => +i);

      if (productIds.length === 0) {
        return [];
      }
    }

    switch (fetchType) {
      case FetchType.Minimal:
        return await this.productRepositoryService.getProductsFetchTypeMinimal(productIds);
      case FetchType.Medium:
        return await this.getProductsFetchTypeMedium(productIds);
      case FetchType.Full:
      default:
        return await this.getProductsFetchTypeFull(productIds);
    }
  }

  public async getProductsFetchTypeMedium(productIds: number[]): Promise<Product[]> {
    let products: Product[];

    products = await this.productRepositoryService.getProductsFetchTypeMediumWithoutOrderItemsAndSupplies(productIds);
    await this.attachOrderItemsStubs(products, productIds);
    await this.attachSuppliesStubs(products, productIds);

    return this.triggerCalculations(products);
  }

  public async getProductsFetchTypeFull(productIds: number[]): Promise<Product[]> {
    let products: Product[];

    products = await this.productRepositoryService.getProductsFetchTypeFullWithoutOrderItemsAndSupplies(productIds);
    await this.attachOrderItemsStubs(products, productIds);
    await this.attachSuppliesStubs(products, productIds);

    return this.triggerCalculations(products);
  }

  public async getProductsIdsByCategoryIds(categoryIds: number[]): Promise<number[]> {
    return await this.productRepositoryService.getProductsIdsByCategoryIds(categoryIds);
  }

  public async getProductsIdsByName(name: string): Promise<number[]> {
    return await this.productRepositoryService.getProductsIdsByName(name);
  }

  public triggerCalculations(products: Product[], dropRelations = true): Product[] {
    products.forEach((product: Product): void => product.calculateQuantity(dropRelations));

    return products;
  }
}
