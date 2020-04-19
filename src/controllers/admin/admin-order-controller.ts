import { Request, Response } from 'express';

import { Order } from '../../entity/order';
import { Status } from '../../models/order.models';
import { OrderService } from '../../services/order/order.service';

export class AdminOrderController {
  public constructor(protected orderService: OrderService = new OrderService()) {}

  public async getOrders(req: Request, res: Response): Promise<void> {
    res.send(await this.orderService.getAdminOrders());
  }

  public async getOrder(req: Request, res: Response): Promise<void> {
    const foundOrder: Order = await this.orderService.getAdminOrder(req.params.id ? +req.params.id : null);

    if (!foundOrder) {
      res.status(404).send();
      return;
    }

    res.send(foundOrder);
  }

  public async patchStatus(req: Request, res: Response): Promise<void> {
    const body: { status: Status } = req.body;

    try {
      await this.orderService.adminChangeStatus(req.params.id ? +req.params.id : null, body.status);
    } catch (error) {
      res.status(500).send({ errorMessage: `${error}` });
      return;
    }

    res.send();
  }
}
