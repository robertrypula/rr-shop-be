import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';

import { Order } from '../entity/order';
import { OrderCreateRequestDto } from '../rest-api/order/order.dtos';
import { validateOrderCreateRequestDto } from '../rest-api/order/order.validators';
import { OrderService } from '../services/order.service';

// tslint:disable:no-console

export class OrderController {
  public constructor(protected orderService: OrderService = new OrderService()) {}

  public async createOrder(req: Request, res: Response): Promise<void> {
    const orderCreateRequestDto: OrderCreateRequestDto = plainToClass(OrderCreateRequestDto, req.body, {
      excludeExtraneousValues: true
    });
    let order: Order;

    try {
      console.log(orderCreateRequestDto);
      console.log('-----');
      const errors: string[] = await validateOrderCreateRequestDto(orderCreateRequestDto);

      console.log('#1', errors);
      if (errors.length) {
        res.status(500).send({ errorDetails: errors, errorMessage: 'Validation errors' });
        return;
      }

      order = await this.orderService.createOrder(orderCreateRequestDto);
    } catch (error) {
      console.log('#2', error);
      res.status(500).send({ errorMessage: 'Could not create order', errorDetails: error });
      return;
    }

    res.status(200).send({}); // { uuid: order.uuid }
  }

  public async getOrder(req: Request, res: Response): Promise<void> {
    const order: Order = await this.orderService.getOrder(req.query.uuid);

    order ? res.send(order) : res.status(404).send({});
  }
}
