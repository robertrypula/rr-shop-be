import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { Product } from '../entity/product';
import { FetchType, ParameterBag } from '../models/product.model';

/*
  Where in:
    https://github.com/typeorm/typeorm/issues/1239
    https://github.com/typeorm/typeorm/issues/2135
*/

export class ProductController {
  public constructor(protected repository: Repository<Product> = getRepository(Product)) {}

  public async getProducts(req: Request, res: Response): Promise<void> {
    const parameterBag: ParameterBag = this.getParameterBag(req);
    let productIds: number[] = null;

    try {
      if (parameterBag.categoryIds) {
        productIds = await this.getProductsIdsByCategoryIds(parameterBag.categoryIds);
      } else if (parameterBag.productIds) {
        productIds = parameterBag.productIds;
      } else if (parameterBag.name) {
        productIds = await this.getProductsIdsByName(parameterBag.name);
      }

      res.send(await this.getProductsByFetchType(productIds, parameterBag.fetchType));
    } catch (e) {
      res.status(500).send({ errorMessage: `${e}` });
    }
  }

  public async getProduct(req: Request, res: Response): Promise<void> {
    const parameterBag: ParameterBag = this.getParameterBag(req);

    try {
      const product: Product[] = await this.getProductsByFetchType([parameterBag.productId], parameterBag.fetchType);

      if (product.length === 1) {
        res.send(product[0]);
      } else {
        res.status(404);
      }
    } catch (e) {
      res.status(500).send({ errorMessage: `${e}` });
    }
  }

  // ---------------------------------------------------------------------------

  protected async getProductsByFetchType(productIds: number[], fetchType: FetchType): Promise<Product[]> {
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

  protected triggerCalculations(products: Product[]): Product[] {
    products.forEach((product: Product): void => product.calculateQuantity(true));

    return products;
  }

  // ---------------------------------------------------------------------------

  protected async getProductsFetchTypeMinimal(productIds: number[]): Promise<Product[]> {
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select(['product.id']);

    productIds !== null && queryBuilder.where('product.id IN (:...productIds)', { productIds });

    return await queryBuilder.getMany();
  }

  protected async getProductsFetchTypeMedium(productIds: number[]): Promise<Product[]> {
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select([
        ...['id', 'name', 'priceUnit', 'slug'].map(c => `product.${c}`),
        ...['id', 'filename', 'sortOrder'].map(c => `image.${c}`),
        ...['quantity'].map(c => `orderItems.${c}`),
        ...['quantity'].map(c => `supplies.${c}`)
      ])
      .leftJoin('product.images', 'image')
      .leftJoin('product.categories', 'category')
      .leftJoin('product.supplies', 'supplies')
      .leftJoin('product.orderItems', 'orderItems');

    productIds !== null && queryBuilder.where('product.id IN (:...productIds)', { productIds });

    return await queryBuilder.getMany();
  }

  protected async getProductsFetchTypeFull(productIds: number[]): Promise<Product[]> {
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select([
        ...['id', 'name', 'priceUnit', 'slug', 'description', 'type', 'deliveryType', 'paymentType'].map(
          c => `product.${c}`
        ),
        ...['id', 'filename', 'sortOrder'].map(c => `image.${c}`),
        ...['quantity'].map(c => `orderItems.${c}`),
        ...['quantity'].map(c => `supplies.${c}`)
      ])
      .leftJoin('product.images', 'image')
      .leftJoin('product.supplies', 'supplies')
      .leftJoin('product.orderItems', 'orderItems');

    productIds !== null && queryBuilder.where('product.id IN (:...productIds)', { productIds });

    return await queryBuilder.getMany();
  }

  // ---------------------------------------------------------------------------

  protected async getProductsIdsByCategoryIds(categoryIds: number[]): Promise<number[]> {
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select('product.id as id')
      .leftJoin('product.categories', 'category')
      .where('category.id IN (:...categoryIds)', { categoryIds });

    return (await queryBuilder.getRawMany()).map((row: { id: number }): number => row.id);
  }

  protected async getProductsIdsByName(name: string): Promise<number[]> {
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select('product.id as id')
      .where('product.name like :name', { name: '%' + name + '%' });

    return (await queryBuilder.getRawMany()).map((row: { id: number }): number => row.id);
  }

  // ---------------------------------------------------------------------------

  protected getParameterBag(req: Request): ParameterBag {
    return {
      categoryIds: this.getIdsAsArray(req, 'categoryIds'),
      fetchType: this.getFetchType(req),
      name: req.query.name ? req.query.name : null,
      productId: req.params.id ? +req.params.id : null,
      productIds: this.getIdsAsArray(req, 'productIds')
    };
  }

  protected getIdsAsArray(req: Request, field: string): number[] {
    return typeof req.query[field] !== 'undefined'
      ? req.query[field] === ''
        ? []
        : req.query[field].split(',').map((categoryId: string): number => +categoryId)
      : null;
  }

  protected getFetchType(req: Request): FetchType {
    switch (req.query.fetchType) {
      case 'minimal':
        return FetchType.Minimal;
      case 'medium':
        return FetchType.Medium;
      case 'full':
        return FetchType.Full;
    }

    return null;
  }
}
