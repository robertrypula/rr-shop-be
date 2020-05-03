import { Product } from '../../entity/product';
import { Supply } from '../../entity/supply';
import { getProductIdsFromProductsRatingMap } from '../../mappers/product.mappers';
import { FetchType, ProductsOrderItems, ProductsRatingMap, ProductsSuppliesCount } from '../../models/product.models';
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

    await this.attachOrderItemsStubs(products, null);
    await this.attachSuppliesStubs(products, null);

    return this.triggerCalculations(products, false);
  }

  public async getProductsByFetchType(productsRatingMap: ProductsRatingMap, fetchType: FetchType): Promise<Product[]> {
    const productIds: number[] = productsRatingMap ? getProductIdsFromProductsRatingMap(productsRatingMap) : null;
    let products: Product[];

    if (productIds && productIds.length === 0) {
      return [];
    }

    switch (fetchType) {
      case FetchType.Minimal:
        products = await this.productRepositoryService.getProductsFetchTypeMinimal(productIds);
        break;
      case FetchType.Medium:
        products = await this.getProductsFetchTypeMedium(productIds);
        break;
      case FetchType.Full:
      default:
        products = await this.getProductsFetchTypeFull(productIds);
    }

    if (productsRatingMap) {
      for (let i = 0; i < products.length; i++) {
        products[i].rating = productsRatingMap[`${products[i].id}`];
      }
      products.sort((a: Product, b: Product): number => (a.rating === b.rating ? 0 : a.rating < b.rating ? 1 : -1));
    }

    return products;
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

  public async getProductsRatingMapByCategoryIds(categoryIds: number[]): Promise<ProductsRatingMap> {
    return await this.productRepositoryService.getProductsRatingMapByCategoryIds(categoryIds);
  }

  public async getProductsRatingMapByQuery(query: string): Promise<ProductsRatingMap> {
    return await this.productRepositoryService.getProductsRatingMapByQuery(query);
  }

  public triggerCalculations(products: Product[], dropRelations = true): Product[] {
    products.forEach((product: Product): void => product.calculateQuantity(dropRelations));

    return products;
  }
}
