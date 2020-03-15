import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { Order } from '../entity/order';
import { OrderItem } from '../entity/order-item';
import { Product } from '../entity/product';
import { Status } from '../models/order.model';
import { OrderCreateRequestDto, OrderCreateRequestOrderItemsDto } from '../rest-api/order.dtos';
import { getOrderNumber } from '../utils/order.utils';

export class OrderController {
  public constructor(
    protected repositoryOrder: Repository<Order> = getRepository(Order),
    protected repositoryProduct: Repository<Product> = getRepository(Product)
  ) {}

  public async createOrder(req: Request, res: Response): Promise<void> {
    const orderDto: OrderCreateRequestDto = req.body;
    let order: Order = new Order();

    try {
      order.status = Status.PaymentWait;

      order.orderItems = [];
      for (let i = 0; i < orderDto.orderItems.length; i++) {
        const orderItemDto: OrderCreateRequestOrderItemsDto = orderDto.orderItems[i];
        const orderItem: OrderItem = new OrderItem();
        const product: Product = await this.repositoryProduct.findOneOrFail(orderItemDto.productId, {
          select: ['id', 'name', 'priceUnit', 'quantity']
        });

        orderItem.nameOriginal = product.name;
        orderItem.priceUnitOriginal = product.priceUnit;
        orderItem.priceUnitSelling = product.priceUnit;
        orderItem.product = product;
        orderItem.quantity = orderItemDto.quantity;

        order.orderItems.push(orderItem);
      }

      order.uuid = uuidv4();
      order.number = getOrderNumber();

      order.email = '';
      order.phone = '';
      order.name = '';
      order.surname = '';
      order.address = '';
      order.zipCode = '';
      order.city = '';

      order = await this.repositoryOrder.save(order);
    } catch (error) {
      res.status(500).send(error);
      return;
    }

    res.status(200).send({ uuid: order.uuid });
  }

  public async getOrder(req: Request, res: Response): Promise<void> {
    const uuid = req.query.uuid;
    const selectQueryBuilder: SelectQueryBuilder<Order> = this.repositoryOrder
      .createQueryBuilder('order')
      .select(['order.uuid', 'order.number', 'order.status', 'orderItems'])
      .leftJoin('order.orderItems', 'orderItems')
      .where('order.uuid = :uuid', { uuid });
    const order: Order = await selectQueryBuilder.getOne();

    order ? res.send(order) : res.status(404).send({});
  }
}
