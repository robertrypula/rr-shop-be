import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';

import { Category } from '../entity/category';

export class OrderController {
  // public constructor(protected repository: Repository<Order> = getRepository(Order)) {}

  public async create(req: Request, res: Response): Promise<void> {
    res.send({ ok: '!!!' });
  }
}
