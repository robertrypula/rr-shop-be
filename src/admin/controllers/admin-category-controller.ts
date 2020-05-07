import { Request, Response } from 'express';

import { Category } from '../../entity/category';
import { AdminCategoryWriteRequestBody } from '../rest-api/category.models';
import { AdminCategoryService } from '../services/category/admin-category.service';

export class AdminCategoryController {
  public constructor(protected adminCategoryService: AdminCategoryService = new AdminCategoryService()) {}

  public async getCategories(req: Request, res: Response): Promise<void> {
    res.send(await this.adminCategoryService.getAdminCategories());
  }

  public async getCategory(req: Request, res: Response): Promise<void> {
    const foundCategory: Category = await this.adminCategoryService.getAdminCategory(
      req.params.id ? +req.params.id : null
    );

    if (!foundCategory) {
      res.status(404).send();
      return;
    }

    res.send(foundCategory);
  }

  public async patchCategory(req: Request, res: Response): Promise<void> {
    const body: AdminCategoryWriteRequestBody = req.body;

    try {
      await this.adminCategoryService.patch(req.params.id ? +req.params.id : null, body);
    } catch (error) {
      res.status(500).send({ errorMessage: `${error}` });
      return;
    }

    res.status(204).send();
  }

  public async createCategory(req: Request, res: Response): Promise<void> {
    const body: AdminCategoryWriteRequestBody = req.body;
    let category: Category;

    try {
      category = await this.adminCategoryService.create(body);
    } catch (error) {
      res.status(500).send({ errorMessage: `${error}` });
      return;
    }

    res.status(200).send(category);
  }
}
