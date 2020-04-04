import { getRepository, Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

import { Product } from '../entity/product';
import { Supply } from '../entity/supply';
import { FetchType, ProductsOrderItems, ProductsSuppliesCount } from '../models/product.model';
import { removeDuplicates } from '../utils/transformation.utils';

export class ProductService {
  public constructor(protected repository: Repository<Product> = getRepository(Product)) {}

  public async attachOrderItemsStubs(products: Product[], productIds: number[]): Promise<void> {
    const productsOrderItems: ProductsOrderItems = await this.getProductsOrderItems(productIds);

    products.forEach((product: Product): void => {
      if (typeof productsOrderItems[product.id] !== 'undefined') {
        product.orderItems = productsOrderItems[product.id];
      }
    });
  }

  public async attachSuppliesStubs(products: Product[], productIds: number[]): Promise<void> {
    const productsSuppliesCount: ProductsSuppliesCount = await this.getProductsSuppliesCount(productIds);

    products.forEach((product: Product): void => {
      if (typeof productsSuppliesCount[product.id] !== 'undefined') {
        product.supplies = [];
        for (let i = 0; i < productsSuppliesCount[product.id]; i++) {
          product.supplies.push(new Supply());
        }
      }
    });
  }

  // ---------------------------------------------------------------------------

  public async getProductsByFetchType(productIds: number[], fetchType: FetchType): Promise<Product[]> {
    if (productIds !== null) {
      productIds = removeDuplicates(productIds.map(i => i + '')).map(i => +i);

      if (productIds.length === 0) {
        return [];
      }
    }

    switch (fetchType) {
      case FetchType.Minimal:
        return await this.getProductsFetchTypeMinimal(productIds);
      case FetchType.Medium:
        return this.triggerCalculations(await this.getProductsFetchTypeMedium(productIds));
      case FetchType.Full:
      default:
        return this.triggerCalculations(await this.getProductsFetchTypeFull(productIds));
    }
  }

  public triggerCalculations(products: Product[]): Product[] {
    products.forEach((product: Product): void => product.calculateQuantity(true));

    return products;
  }

  // ---------------------------------------------------------------------------

  public async getProductsFetchTypeMinimal(productIds: number[]): Promise<Product[]> {
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select(['product.id']);

    productIds !== null && queryBuilder.where('product.id IN (:...productIds)', { productIds });

    return await queryBuilder.getMany();
  }

  public async getProductsFetchTypeMedium(productIds: number[]): Promise<Product[]> {
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select([
        ...['id', 'name', 'priceUnit', 'slug'].map(c => `product.${c}`),
        ...['id', 'filename', 'sortOrder'].map(c => `image.${c}`)
      ])
      .leftJoin('product.images', 'image');
    let products: Product[];

    productIds !== null && queryBuilder.where('product.id IN (:...productIds)', { productIds });
    products = await queryBuilder.getMany();

    await this.attachOrderItemsStubs(products, productIds);
    await this.attachSuppliesStubs(products, productIds);

    return products;
  }

  public async getProductsFetchTypeFull(productIds: number[]): Promise<Product[]> {
    if (!productIds || productIds.length !== 1) {
      throw new Error('Fetching more than one full products is not supported');
    }

    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select([
        ...['id', 'name', 'priceUnit', 'slug', 'description', 'type', 'deliveryType', 'paymentType'].map(
          c => `product.${c}`
        ),
        ...['id', 'filename', 'sortOrder'].map(c => `image.${c}`),
        ...['quantity'].map(c => `orderItems.${c}`),
        ...['id'].map(c => `supplies.${c}`)
      ])
      .leftJoin('product.images', 'image')
      .leftJoin('product.supplies', 'supplies')
      .leftJoin('product.orderItems', 'orderItems');

    // TODO filter out CANCELLED orders - they don't count in quantity
    queryBuilder.where('product.id IN (:...productIds)', { productIds });

    return await queryBuilder.getMany();
  }

  // ---------------------------------------------------------------------------

  public async getProductsIdsByCategoryIds(categoryIds: number[]): Promise<number[]> {
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select('product.id as id')
      .leftJoin('product.categories', 'category')
      .where('category.id IN (:...categoryIds)', { categoryIds });

    return (await queryBuilder.getRawMany()).map((row: { id: number }): number => row.id);
  }

  public async getProductsIdsByName(name: string): Promise<number[]> {
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select('product.id as id')
      .where('product.name like :name', { name: '%' + name + '%' });

    return (await queryBuilder.getRawMany()).map((row: { id: number }): number => row.id);
  }

  // ---------------------------------------------------------------------------

  public async getProductsOrderItems(productIds: number[]): Promise<ProductsOrderItems> {
    const productsOrderItems: ProductsOrderItems = {};
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select(['product.id', 'orderItems.quantity', 'order.status'])
      .leftJoin('product.orderItems', 'orderItems')
      .leftJoin('orderItems.order', 'order');

    productIds !== null && queryBuilder.where('product.id IN (:...productIds)', { productIds });

    (await queryBuilder.getMany()).forEach((product: Product): void => {
      productsOrderItems[product.id] = product.orderItems;
    });

    return productsOrderItems;
  }

  public async getProductsSuppliesCount(productIds: number[]): Promise<ProductsSuppliesCount> {
    const productsSuppliesCount: ProductsSuppliesCount = {};
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select('product.id', 'productId')
      .addSelect('COUNT(supplies.id)', 'suppliesCount')
      .leftJoin('product.supplies', 'supplies')
      .groupBy('product.id');

    productIds !== null && queryBuilder.where('product.id IN (:...productIds)', { productIds });

    (await queryBuilder.getRawMany()).forEach((raw: { productId: number; suppliesCount: number }): void => {
      productsSuppliesCount[raw.productId] = raw.suppliesCount;
    });

    return productsSuppliesCount;
  }
}
