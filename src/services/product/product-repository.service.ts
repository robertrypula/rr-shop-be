import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { Product } from '../../entity/product';
import { ProductsOrderItems, ProductsSuppliesCount } from '../../models/product.models';

export class ProductRepositoryService {
  public constructor(protected repository: Repository<Product> = getRepository(Product)) {}

  // ---------------------------------------------------------------------------

  public async getProductsFetchTypeMinimal(productIds: number[]): Promise<Product[]> {
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select(['product.id']);

    productIds !== null && queryBuilder.where('product.id IN (:...productIds)', { productIds });

    return await queryBuilder.getMany();
  }

  public async getProductsFetchTypeMediumWithoutOrderItemsAndSupplies(productIds: number[]): Promise<Product[]> {
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select([
        ...['id', 'name', 'priceUnit', 'slug'].map(c => `product.${c}`),
        ...['id', 'filename', 'sortOrder'].map(c => `image.${c}`),
        ...['name'].map(c => `manufacturer.${c}`)
      ])
      .leftJoin('product.images', 'image')
      .leftJoin('product.manufacturer', 'manufacturer');
    let products: Product[];

    productIds !== null && queryBuilder.where('product.id IN (:...productIds)', { productIds });
    products = await queryBuilder.getMany();

    return products;
  }

  public async getProductsFetchTypeFullWithoutOrderItemsAndSupplies(productIds: number[]): Promise<Product[]> {
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select([
        ...['id', 'name', 'priceUnit', 'slug', 'description', 'type', 'deliveryType', 'paymentType'].map(
          c => `product.${c}`
        ),
        ...['id', 'filename', 'sortOrder'].map(c => `image.${c}`),
        ...['name'].map(c => `manufacturer.${c}`),
        ...['id', 'filename', 'sortOrder'].map(c => `manufacturerImage.${c}`)
      ])
      .leftJoin('product.images', 'image')
      .leftJoin('product.manufacturer', 'manufacturer')
      .leftJoin('manufacturer.images', 'manufacturerImage');
    let products: Product[];

    productIds !== null && queryBuilder.where('product.id IN (:...productIds)', { productIds });
    products = await queryBuilder.getMany();

    return products;
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

  public async getProductsSuppliesCount(
    productIds: number[],
    countOnlyAvailable: boolean
  ): Promise<ProductsSuppliesCount> {
    const productsSuppliesCount: ProductsSuppliesCount = {};
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select(['product.id as productId', 'COUNT(*) as suppliesCount'])
      .leftJoin('product.supplies', 'supplies')
      .where('1 = 1')
      .groupBy('supplies.productId');

    countOnlyAvailable && queryBuilder.andWhere('supplies.isUnavailable is false');
    productIds !== null && queryBuilder.andWhere('product.id IN (:...productIds)', { productIds });

    (await queryBuilder.getRawMany()).forEach((raw: { productId: number; suppliesCount: number }): void => {
      productsSuppliesCount[raw.productId] = raw.suppliesCount;
    });

    return productsSuppliesCount;
  }
}
