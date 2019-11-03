import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';

import { Product } from '../entity/product';

export class ProductController {
  public constructor(protected repository: Repository<Product> = getRepository(Product)) {}

  public async all(req: Request, res: Response): Promise<void> {
    res.send(
      await this.repository.find({
        relations: ['categories']
      })
    );
  }
}
