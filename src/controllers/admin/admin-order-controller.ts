import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';

import { Order } from '../../entity/order';
import { Status } from '../../model';

const data = [
  { id: 1, number: 'WA-123-546', status: Status.PaymentWait },
  { id: 2, number: 'WA-445-433', status: Status.Cancelled },
  { id: 3, number: 'WA-654-454', status: Status.Shipped },
  { id: 4, number: 'WA-876-543', status: Status.Completed }
];

export class AdminOrderController {
  public constructor(protected repository: Repository<Order> = getRepository(Order)) {}

  public async getOrders(req: Request, res: Response): Promise<void> {
    res.send(data.map(item => ({ id: item.id, number: item.number })));
  }

  public async getOrder(req: Request, res: Response): Promise<void> {
    const found = data.find(item => `${item.id}` === req.params.id);

    if (!found) {
      res.status(404).send();
      return;
    }

    res.send(found);
  }
}
