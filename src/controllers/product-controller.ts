import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

import { Category } from '../entity/category';
import { Product } from '../entity/product';

/*
  Where in:
    https://github.com/typeorm/typeorm/issues/1239
    https://github.com/typeorm/typeorm/issues/2135
*/

export class ProductController {
  public constructor(protected repository: Repository<Product> = getRepository(Product)) {}

  public async getProducts(req: Request, res: Response): Promise<void> {
    const categoryIds: number[] = this.getCategoryIds(req);
    const isSimple: boolean = this.getIsSimple(req);
    let queryBuilder: SelectQueryBuilder<Product>;
    let products: Product[] = [];

    if (!categoryIds || categoryIds.length !== 0) {
      queryBuilder = categoryIds
        ? this.getQueryBuilderFilteredByCategoryIds(isSimple, categoryIds)
        : this.getQueryBuilder(isSimple);
      products = await queryBuilder.getMany();
      this.cleanProductsRelations(products);
    }

    res.send(products);
  }

  public async getProduct(req: Request, res: Response): Promise<void> {
    const columns: string[] = ['id', 'name', 'slug', 'price', 'description'];
    const product: Product = await this.repository
      .createQueryBuilder('product')
      .select([...columns.map(c => `product.${c}`), 'category.id'])
      .leftJoin('product.categories', 'category')
      .where('product.id = :id', { id: this.getId(req) })
      .getOne();

    product ? res.send(product) : res.status(404).send({});
  }

  protected getQueryBuilderFilteredByCategoryIds(
    isSimple: boolean,
    categoryIds: number[]
  ): SelectQueryBuilder<Product> {
    return this.repository
      .createQueryBuilder('product')
      .select([`product.id`, ...this.getProductColumnsSelection(isSimple), 'category.id'])
      .leftJoin('product.categories', 'category')
      .where(qb => {
        const subQuery = qb
          .subQuery()
          .select('product.id')
          .from(Product, 'product')
          .leftJoin('product.categories', 'category')
          .where('category.id IN (:...categoryIds)', { categoryIds })
          .getQuery();
        return 'product.id IN ' + subQuery;
      });
  }

  protected getQueryBuilder(isSimple: boolean): SelectQueryBuilder<Product> {
    return this.repository
      .createQueryBuilder('product')
      .select([`product.id`, ...this.getProductColumnsSelection(isSimple), 'category.id'])
      .leftJoin('product.categories', 'category');
  }

  protected getProductColumnsSelection(isSimple: boolean): string[] {
    return isSimple ? [] : ['name', 'slug', 'price'].map(c => `product.${c}`);
  }

  protected clearProductRelations(product: Product): void {
    if (product.categories) {
      product.categoryIds = product.categories.map((category: Category) => category.id);
      delete product.categories;
    }
  }

  protected cleanProductsRelations(products: Product[]): void {
    products.forEach((product: Product): void => this.clearProductRelations(product));
  }

  protected getCategoryIds(req: Request): number[] {
    return typeof req.query.categoryIds !== 'undefined'
      ? req.query.categoryIds === ''
        ? []
        : req.query.categoryIds.split(',').map((categoryId: string): number => +categoryId)
      : null;
  }

  protected getId(req: Request): number {
    return req.params.id ? +req.params.id : null;
  }

  protected getIsSimple(req: Request): boolean {
    return req.query.isSimple && req.query.isSimple === 'true';
  }
}
