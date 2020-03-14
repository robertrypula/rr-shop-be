import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';

import { Category } from '../entity/category';
import { Status } from '../model';

export class OrderController {
  // public constructor(protected repository: Repository<Order> = getRepository(Order)) {}

  public async createOrder(req: Request, res: Response): Promise<void> {
    res.status(200).send({ uuid: 'abde' });
  }

  public async getOrder(req: Request, res: Response): Promise<void> {
    res.status(200).send({ uuid: 'abde', number: 'WA-123-123', status: Status.PaymentWait });
  }
}
