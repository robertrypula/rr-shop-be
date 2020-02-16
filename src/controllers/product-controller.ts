import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

import { Category } from '../entity/category';
import { Product } from '../entity/product';

export class ProductController {
  public constructor(protected repository: Repository<Product> = getRepository(Product)) {}

  public async all(req: Request, res: Response): Promise<void> {
    const isSimple: boolean = req.query.simple && req.query.simple === 'true';
    const categoryId: number = req.query.categoryId && +req.query.categoryId > 0 ? req.query.categoryId : null;
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select([
        `product.id`,
        ...(isSimple ? [] : ['name', 'slug', 'price'].map(column => `product.${column}`)),
        'category.id'
      ])
      .leftJoin('product.categories', 'category');
    let products: Product[];

    categoryId && queryBuilder.where('category.id = :categoryId', { categoryId });
    products = await queryBuilder.getMany();
    products.forEach((product: Product): void => {
      product.categoryIds = product.categories.map((category: Category) => category.id);
      delete product.categories;
    });

    res.send(products);
  }
}
