import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { PRODUCT_SEARCH_RATING_THRESHOLD } from '../../config';
import { Product } from '../../entity/product';
import { ProductQueryResult, ProductsOrderItems, ProductsSuppliesCount, Type } from '../../models/product.models';
import { getProcessedProductQueryResults } from '../../utils/search.utils';

export class ProductRepositoryService {
  public constructor(protected repository: Repository<Product> = getRepository(Product)) {}

  // ---------------------------------------------------------------------------

  public async getAdminProduct(id: number): Promise<Product> {
    const selectQueryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select([
        'product',
        'orderItems',
        ...['order.number', 'order.status'],
        ...['orderItemsSupplies.bestBefore'],
        'productSupplies',
        'productSuppliesOrderItem.priceUnitSelling',
        ...['productSuppliesOrderItemOrder.number', 'productSuppliesOrderItemOrder.status'],
        'distributor',
        'manufacturer'
      ])
      .leftJoin('product.orderItems', 'orderItems')
      .leftJoin('orderItems.order', 'order')
      .leftJoin('orderItems.supplies', 'orderItemsSupplies')
      .leftJoin('product.supplies', 'productSupplies')
      .leftJoin('productSupplies.orderItem', 'productSuppliesOrderItem')
      .leftJoin('productSuppliesOrderItem.order', 'productSuppliesOrderItemOrder')
      .leftJoin('product.distributor', 'distributor')
      .leftJoin('product.manufacturer', 'manufacturer')
      .where('product.id = :id', { id });

    return await selectQueryBuilder.getOne();
  }

  public async getAdminProducts(): Promise<Product[]> {
    const selectQueryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select([
        ...['id', 'externalId', 'name', 'nameCashRegister', 'priceUnit', 'isHidden', 'type'].map(c => `product.${c}`),
        'manufacturer.name'
      ])
      // .leftJoin('product.distributor', 'distributor')
      .leftJoin('product.manufacturer', 'manufacturer')
      // .where('product.type = :type', { type: Type.Product })
      .orderBy('product.externalId', 'ASC');

    return await selectQueryBuilder.getMany();
  }

  // ---------------------------------------------------------------------------

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
        ...['id', 'name', 'priceUnit', 'slug', 'type'].map(c => `product.${c}`),
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
        ...['id', 'name', 'priceUnit', 'slug', 'description', 'type', 'deliveryType', 'paymentType'].map(
          c => `product.${c}`
        ),
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

  public async getProductsIdsByCategoryIds(categoryIds: number[], excludeHidden = true): Promise<number[]> {
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select('product.id as id')
      .leftJoin('product.categories', 'category')
      .where('category.id IN (:...categoryIds)', { categoryIds });

    excludeHidden && queryBuilder.andWhere('product.isHidden is false');

    return (await queryBuilder.getRawMany()).map((row: { id: number }): number => row.id);
  }

  public async getProductsIdsByQuery(query: string, excludeHidden = true): Promise<number[]> {
    let productQueryResults: ProductQueryResult[];
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select([...['id as id', 'name as name'].map(c => `product.${c}`), 'manufacturer.name as manufacturerName'])
      .leftJoin('product.manufacturer', 'manufacturer')
      .andWhere('product.type = :type', { type: Type.Product });

    excludeHidden && queryBuilder.andWhere('product.isHidden is false');

    productQueryResults = (await queryBuilder.getRawMany<ProductQueryResult>()).map(
      (raw: any): ProductQueryResult => ({ id: raw.id, name: raw.name, manufacturerName: raw.manufacturerName })
    );

    return getProcessedProductQueryResults(productQueryResults, query, PRODUCT_SEARCH_RATING_THRESHOLD).map(
      (productQueryResult: ProductQueryResult): number => productQueryResult.id
    );
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
