import { getRepository, Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

import { Product } from '../entity/product';
import { FetchType } from '../models/product.model';
import { removeDuplicates } from '../utils/transformation.utils';

export class ProductService {
  public constructor(protected repository: Repository<Product> = getRepository(Product)) {}

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
        // ...['quantity'].map(c => `orderItems.${c}`)
      ])
      .leftJoin('product.images', 'image');
    // .leftJoin('product.orderItems', 'orderItems');

    // TODO filter out CANCELLED orders - they don't count in quantity

    productIds !== null && queryBuilder.where('product.id IN (:...productIds)', { productIds });

    return await queryBuilder.getMany();
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

  public async getSuppliesCount(productIds: number[]): Promise<Array<{ productId: number; suppliesCount: number }>> {
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select('product.id', 'productId')
      .addSelect('COUNT(supplies.id)', 'suppliesCount')
      .leftJoin('product.supplies', 'supplies')
      .groupBy('product.id');

    productIds !== null && queryBuilder.where('product.id IN (:...productIds)', { productIds });

    return await queryBuilder.getRawMany();
  }
}
