import { validate, ValidationError } from 'class-validator';
import { getRepository, Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { v4 as uuidv4 } from 'uuid';

import { Order } from '../entity/order';
import { OrderItem } from '../entity/order-item';
import { Product } from '../entity/product';
import { Status } from '../models/order.model';
import { OrderCreateRequestDto } from '../rest-api/order.dtos';
import { fromOrderCreateRequestDto } from '../rest-api/order.mappers';
import { getOrderNumber } from '../utils/order.utils';
import { EmailService } from './email.service';
import { TemplateService } from './template.service';

export class OrderService {
  public constructor(
    protected repository: Repository<Order> = getRepository(Order),
    protected repositoryProduct: Repository<Product> = getRepository(Product),
    protected emailService: EmailService = new EmailService(),
    protected templateService: TemplateService = new TemplateService()
  ) {}

  public async createOrder(orderDto: OrderCreateRequestDto): Promise<Order> {
    const order: Order = fromOrderCreateRequestDto(orderDto);
    let validationErrors: ValidationError[];

    order.status = Status.PaymentWait;
    order.uuid = uuidv4();
    order.number = getOrderNumber();

    order.promoCode = null;

    order.orderItems.forEach((orderItem: OrderItem): void => {
      orderItem.name = 'dua';
      orderItem.vat = 12.3;
    });

    validationErrors = await validate(order);
    if (validationErrors.length) {
      throw `${JSON.stringify(validationErrors.map(validationError => validationError.constraints))}`;
    }

    await this.emailService.add(
      'robert.rypula@gmail.com',
      this.templateService.getOrderEmailSubject(order),
      this.templateService.getOrderEmailHtml(order)
    );

    return await this.repository.save(order);
    /*
    order.orderItems = [];
    for (let i = 0; i < orderDto.orderItems.length; i++) {
      const orderItemDto: OrderCreateRequestOrderItemsDto = orderDto.orderItems[i];
      const orderItem: OrderItem = new OrderItem();
      const product: Product = await this.repositoryProduct.findOneOrFail(orderItemDto.productId, {
        select: ['id', 'name', 'priceUnit']
      });

      orderItem.name = product.name;
      orderItem.vat = 0; // should be latest VAT from supply table
      orderItem.priceUnitOriginal = product.priceUnit;
      orderItem.priceUnitSelling = product.priceUnit;
      orderItem.product = product;
      orderItem.quantity = orderItemDto.quantity;

      // TODO fill in type

      order.orderItems.push(orderItem);
    }
    */
  }

  public async getOrder(uuid: string): Promise<Order> {
    const selectQueryBuilder: SelectQueryBuilder<Order> = this.repository
      .createQueryBuilder('order')
      .select([
        ...['uuid', 'number', 'status'].map(c => `order.${c}`),
        ...['name', 'priceUnitSelling', 'priceUnitOriginal', 'quantity', 'type', 'productId'].map(
          c => `orderItems.${c}`
        )
      ])
      .leftJoin('order.orderItems', 'orderItems')
      .where('order.uuid = :uuid', { uuid });

    return await selectQueryBuilder.getOne();
  }
}
