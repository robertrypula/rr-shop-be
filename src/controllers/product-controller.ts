import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';

import { Category } from '../entity/category';
import { Product } from '../entity/product';

export class ProductController {
  public constructor(protected repository: Repository<Product> = getRepository(Product)) {}

  public async all(req: Request, res: Response): Promise<void> {
    const isSimple = req.query.simple && req.query.simple === 'true';

    const products: Product[] = await this.repository
      .createQueryBuilder('product')
      .select([
        `product.id`,
        ...(isSimple ? [] : ['name', 'slug', 'price'].map(column => `product.${column}`)),
        'category.id'
      ])
      .leftJoin('product.categories', 'category')
      .getMany();

    products.forEach((product: Product): void => {
      product.categoryIds = product.categories.map((category: Category) => category.id);
      delete product.categories;
    });

    res.send(products);
  }
}
