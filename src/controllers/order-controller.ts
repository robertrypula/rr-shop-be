import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';

import { Order } from '../entity/order';
import { OrderCreateRequestDto } from '../rest-api/order/order.dtos';
import { validateOrderCreateRequestDto } from '../rest-api/order/order.validators';
import { OrderService } from '../services/order/order.service';

export class OrderController {
  public constructor(protected orderService: OrderService = new OrderService()) {}

  public async createOrder(req: Request, res: Response): Promise<void> {
    const orderCreateRequestDto: OrderCreateRequestDto = plainToClass(OrderCreateRequestDto, req.body, {
      excludeExtraneousValues: true
    });
    let order: Order;

    try {
      await validateOrderCreateRequestDto(orderCreateRequestDto);
    } catch (errors) {
      res.status(400).send({ errorDetails: errors, errorMessage: 'Validation errors' });
      return;
    }

    try {
      order = await this.orderService.createOrder(orderCreateRequestDto, req.ip);
    } catch (error) {
      // TODO catch validation errors and return 400 HTTP CODE
      res.status(500).send({ errorMessage: 'Could not create order', errorDetails: error });
      return;
    }

    /*
    try {
      console.log(inspect(order, { depth: null, colors: true }));
    } catch (error) {
      console.log(error);
    }
    */

    res.status(200).send({ uuid: order.uuid });
  }

  public async getOrder(req: Request, res: Response): Promise<void> {
    const order: Order = await this.orderService.getOrder(`${req.query.uuid}`);

    order ? res.send(order) : res.status(404).send({});
  }
}
