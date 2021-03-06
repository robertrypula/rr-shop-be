import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { Product } from '../../entity/product';
import {
  getProductQueryResultsFromRawRowsByQuery,
  getProductsRatingMapFromProductQueryResults,
  getProductsRatingMapFromRawRowsByCategoryIds
} from '../../mappers/product.mappers';
import { ProductsOrderItems, ProductsRatingMap, ProductsSuppliesCount, Type } from '../../models/product.models';
import { getProcessedProductQueryResults } from '../../utils/search.utils';

export class ProductRepositoryService {
  public constructor(protected repository: Repository<Product> = getRepository(Product)) {}

  public async getProductsFetchTypeMinimal(productIds: number[], excludeHidden = true): Promise<Product[]> {
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select(['product.id'])
      .where('1 = 1');

    productIds !== null && queryBuilder.andWhere('product.id IN (:...productIds)', { productIds });
    excludeHidden && queryBuilder.andWhere('product.isHidden is false');

    return await queryBuilder.getMany();
  }

  public async getProductsFetchTypeMediumWithoutOrderItemsAndSupplies(
    productIds: number[],
    excludeHidden = true
  ): Promise<Product[]> {
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select([
        ...['id', 'name', 'priceUnit', 'priceUnitBeforePromotion', 'slug', 'type'].map(c => `product.${c}`),
        ...['id', 'filename', 'sortOrder'].map(c => `image.${c}`),
        ...['name'].map(c => `manufacturer.${c}`)
      ])
      .leftJoin('product.images', 'image')
      .leftJoin('product.manufacturer', 'manufacturer')
      .where('1 = 1');

    productIds !== null && queryBuilder.andWhere('product.id IN (:...productIds)', { productIds });
    excludeHidden && queryBuilder.andWhere('product.isHidden is false');

    return await queryBuilder.getMany();
  }

  public async getProductsFetchTypeFullWithoutOrderItemsAndSupplies(
    productIds: number[],
    excludeHidden = true
  ): Promise<Product[]> {
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select([
        ...[
          'id',
          'name',
          'priceUnit',
          'priceUnitBeforePromotion',
          'slug',
          'description',
          'descriptionDelivery',
          'isDeliveryBlockedCourier',
          'isDeliveryBlockedParcelLocker',
          'type',
          'deliveryType',
          'paymentType'
        ].map(c => `product.${c}`),
        ...['id', 'filename', 'sortOrder'].map(c => `image.${c}`),
        ...['name'].map(c => `manufacturer.${c}`),
        ...['id', 'filename', 'sortOrder'].map(c => `manufacturerImage.${c}`)
      ])
      .leftJoin('product.images', 'image')
      .leftJoin('product.manufacturer', 'manufacturer')
      .leftJoin('manufacturer.images', 'manufacturerImage')
      .where('1 = 1');

    productIds !== null && queryBuilder.andWhere('product.id IN (:...productIds)', { productIds });
    excludeHidden && queryBuilder.andWhere('product.isHidden is false');

    return await queryBuilder.getMany();
  }

  // ---------------------------------------------------------------------------

  public async getProductsRatingMapByCategoryIds(
    categoryIds: number[],
    excludeHidden = true
  ): Promise<ProductsRatingMap> {
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select('product.id as id')
      .leftJoin('product.categories', 'category')
      .where('category.id IN (:...categoryIds)', { categoryIds });

    excludeHidden && queryBuilder.andWhere('product.isHidden is false');

    return getProductsRatingMapFromRawRowsByCategoryIds(await queryBuilder.getRawMany());
  }

  public async getProductsRatingMapByQuery(query: string, excludeHidden = true): Promise<ProductsRatingMap> {
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select([
        ...['id as id', 'name as name', 'tags as tags'].map(c => `product.${c}`),
        'manufacturer.name as manufacturerName'
      ])
      .leftJoin('product.manufacturer', 'manufacturer')
      .where('product.type = :type', { type: Type.Product });

    excludeHidden && queryBuilder.andWhere('product.isHidden is false');

    return getProductsRatingMapFromProductQueryResults(
      getProcessedProductQueryResults(getProductQueryResultsFromRawRowsByQuery(await queryBuilder.getRawMany()), query)
    );
  }

  // ---------------------------------------------------------------------------

  public async getProductsOrderItems(productIds: number[]): Promise<ProductsOrderItems> {
    const productsOrderItems: ProductsOrderItems = {};
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select(['product.id', 'orderItems.quantity', 'order.status'])
      .leftJoin('product.orderItems', 'orderItems')
      .leftJoin('orderItems.order', 'order')
      .where('1 = 1');

    productIds !== null && queryBuilder.andWhere('product.id IN (:...productIds)', { productIds });

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
