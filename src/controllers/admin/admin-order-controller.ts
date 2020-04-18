import { Request, Response } from 'express';

import { Order } from '../../entity/order';
import { OrderRepositoryService } from '../../services/order/order-repository.service';

export class AdminOrderController {
  public constructor(protected orderRepositoryService: OrderRepositoryService = new OrderRepositoryService()) {}

  public async getOrders(req: Request, res: Response): Promise<void> {
    res.send(await this.orderRepositoryService.getAdminOrders());
  }

  public async getOrder(req: Request, res: Response): Promise<void> {
    const foundOrder: Order = await this.orderRepositoryService.getAdminOrder(req.params.id);

    if (!foundOrder) {
      res.status(404).send();
      return;
    }

    res.send(foundOrder);
  }
}
