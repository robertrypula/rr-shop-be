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
      this.cleanProductsCategoriesRelations(products);
    }

    res.send(products);
  }

  public async getProduct(req: Request, res: Response): Promise<void> {
    // console.log(await this.getProductsIdsByName('pgfr'));
    //
    // res.send({});
    const columns: string[] = ['id', 'name', 'slug', 'priceUnit', 'description'];
    const product: Product = await this.repository
      .createQueryBuilder('product')
      .select([...columns.map(c => `product.${c}`), 'category.id', ...this.getImageColumnsSelection(false)])
      .leftJoin('product.categories', 'category')
      .leftJoin('product.images', 'image')
      .where('product.id = :id', { id: this.getId(req) })
      .getOne();

    product && this.clearProductCategoriesRelations(product);

    product ? res.send(product) : res.status(404).send({});
  }

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

  protected getQueryBuilderFilteredByCategoryIds(
    isSimple: boolean,
    categoryIds: number[]
  ): SelectQueryBuilder<Product> {
    let queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select([
        `product.id`,
        ...this.getProductColumnsSelection(isSimple),
        'category.id',
        ...this.getImageColumnsSelection(isSimple)
      ])
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

    if (!isSimple) {
      queryBuilder = queryBuilder.leftJoin('product.images', 'image');
    }

    return queryBuilder;
  }

  protected getQueryBuilder(isSimple: boolean): SelectQueryBuilder<Product> {
    let queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select([
        `product.id`,
        ...this.getProductColumnsSelection(isSimple),
        'category.id',
        ...this.getImageColumnsSelection(isSimple)
      ])
      .leftJoin('product.categories', 'category');

    if (!isSimple) {
      queryBuilder = queryBuilder.leftJoin('product.images', 'image');
    }

    return queryBuilder;
  }

  protected getImageColumnsSelection(isSimple: boolean): string[] {
    return isSimple ? [] : ['id', 'filename', 'sortOrder'].map(c => `image.${c}`);
  }

  protected getProductColumnsSelection(isSimple: boolean): string[] {
    return isSimple ? [] : ['name', 'slug', 'priceUnit'].map(c => `product.${c}`);
  }

  protected clearProductCategoriesRelations(product: Product): void {
    if (product.categories) {
      product.categoryIds = product.categories.map((category: Category) => category.id);
      delete product.categories;
    }
  }

  protected cleanProductsCategoriesRelations(products: Product[]): void {
    products.forEach((product: Product): void => this.clearProductCategoriesRelations(product));
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
