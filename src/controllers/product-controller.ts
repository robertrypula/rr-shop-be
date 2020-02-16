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

  public async all(req: Request, res: Response): Promise<void> {
    const isSimple: boolean = req.query.simple && req.query.simple === 'true';
    const categoryIds: number[] =
      typeof req.query.categoryIds !== 'undefined'
        ? req.query.categoryIds === ''
          ? []
          : req.query.categoryIds.split(',').map((categoryId: string): number => +categoryId)
        : null;

    if (categoryIds && categoryIds.length === 0) {
      res.send([]);
      return;
    }

    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select([
        `product.id`,
        ...(isSimple ? [] : ['name', 'slug', 'price'].map(column => `product.${column}`)),
        'category.id'
      ])
      .leftJoin('product.categories', 'category', '');
    let products: Product[];

    if (categoryIds) {
      queryBuilder.where('category.id IN (:...categoryIds)', { categoryIds });
    }

    products = await queryBuilder.getMany();
    products.forEach((product: Product): void => {
      if (product.categories) {
        product.categoryIds = product.categories.map((category: Category) => category.id);
        delete product.categories;
      }
    });

    res.send(products);
  }
}
