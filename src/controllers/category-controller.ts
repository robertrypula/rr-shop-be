import { Request, Response } from 'express';

import { Category } from '../entity/category';
import { CategoryService } from '../services/category/category.service';

export class CategoryController {
  public constructor(protected categoryService: CategoryService = new CategoryService()) {}

  public async getCategories(req: Request, res: Response): Promise<void> {
    let categories: Category[];

    try {
      categories = await this.categoryService.getCategories();
    } catch (error) {
      res.status(500).send({ error });
      return;
    }

    res.send(categories);
  }
}
