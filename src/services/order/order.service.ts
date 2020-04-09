import { getRepository, Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { v4 as uuidv4 } from 'uuid';

import { Email } from '../../entity/email';
import { Order } from '../../entity/order';
import { OrderItem } from '../../entity/order-item';
import { Product } from '../../entity/product';
import { fromOrderCreateRequestDto } from '../../mappers/order.mappers';
import { Status } from '../../models/order.models';
import { OrderCreateRequestDto } from '../../rest-api/order/order.dtos';
import { getOrderNumber } from '../../utils/order.utils';
import { TemplateService } from '../template.service';

export class OrderService {
  public constructor(
    protected repository: Repository<Order> = getRepository(Order),
    protected repositoryProduct: Repository<Product> = getRepository(Product),
    protected repositoryEmail: Repository<Email> = getRepository(Email),
    protected templateService: TemplateService = new TemplateService()
  ) {}

  public async createOrder(orderCreateRequestDto: OrderCreateRequestDto): Promise<Order> {
    let order: Order = fromOrderCreateRequestDto(orderCreateRequestDto);
    let email: Email;

    // ----------------------------------------

    order.status = Status.PaymentWait;
    order.uuid = uuidv4();
    order.number = getOrderNumber();

    order.promoCode = null;

    order.orderItems.forEach((orderItem: OrderItem): void => {
      orderItem.name = 'dua';
    });

    email = new Email()
      .setTo(order.email)
      .setSubject(this.templateService.getOrderEmailSubject(order))
      .setHtml(this.templateService.getOrderEmailHtml(order));

    email = await this.repositoryEmail.save(email);
    order = await this.repository.save(order);

    // TODO add relation between order/email with cascade insert
    // Cascade relation save looks like to be wrapped with transaction
    // https://github.com/typeorm/typeorm/issues/1025#issuecomment-343122704

    return order;
    /*
    order.orderItems = [];
    for (let i = 0; i < orderCreateRequestDto.orderItems.length; i++) {
      const orderItemDto: OrderCreateRequestOrderItemsDto = orderCreateRequestDto.orderItems[i];
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
}