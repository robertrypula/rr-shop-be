import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';

import { Category } from '../entity/category';

export class CategoryController {
  public constructor(protected repository: Repository<Category> = getRepository(Category)) {}

  public async all(req: Request, res: Response): Promise<void> {
    // TODO move it to repository class
    const categories: Category[] = await this.repository
      .createQueryBuilder('category')
      .select(
        ['id', 'name', 'slug', 'content', 'isNotClickable', 'isWithoutProducts', 'structuralNode', 'parentId'].map(
          c => `category.${c}`
        )
      )
      .where('category.isInternal is not true')
      .getMany();

    res.send(categories);

    /*
    const categories: Category[] = await this.repository
      .createQueryBuilder('category')
      .select(['category.id', 'category.name', 'parentId'])
      .leftJoin('category.children', 'children')
      .getMany();
    res.send(categories);
    */

    /*
    const categories: Category[] = await this.repository
      .createQueryBuilder('category')
      .select(['category.id', 'category.name', 'children.id'])
      .leftJoin('category.children', 'children')
      .getMany();
    res.send(categories);
    */

    /*
    res.send(await this.repository.find({ select: ['id', 'name', 'parentId'] }));
    */

    /*
    res.send(
      await this.repository.find({
        relations: ['children']
      })
    );
    */
  }
}
