import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';

import { Order } from '../entity/order';
import { Product } from '../entity/product';
import { OrderCreateRequestDto } from '../rest-api/order.dtos';
import { OrderService } from '../services/order.service';

export class OrderController {
  public constructor(
    protected repositoryOrder: Repository<Order> = getRepository(Order),
    protected repositoryProduct: Repository<Product> = getRepository(Product),
    protected orderService: OrderService = new OrderService()
  ) {}

  public async createOrder(req: Request, res: Response): Promise<void> {
    const orderDto: OrderCreateRequestDto = req.body;
    let order: Order;

    try {
      order = await this.orderService.createOrder(orderDto);
    } catch (error) {
      res.status(500).send({ errorMessage: `${error}` });
      return;
    }

    res.status(200).send({ uuid: order.uuid });
  }

  public async getOrder(req: Request, res: Response): Promise<void> {
    const order: Order = await this.orderService.getOrder(req.query.uuid);

    order ? res.send(order) : res.status(404).send({});
  }
}
