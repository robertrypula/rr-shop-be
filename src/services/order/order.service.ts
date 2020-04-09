import { getRepository, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { Email } from '../../entity/email';
import { Order } from '../../entity/order';
import { OrderItem } from '../../entity/order-item';
import { Product } from '../../entity/product';
import { PromoCode } from '../../entity/promo-code';
import { fromOrderCreateRequestDto } from '../../mappers/order.mappers';
import { Status } from '../../models/order.models';
import { OrderCreateRequestDto, OrderCreateRequestPromoCodeDto } from '../../rest-api/order/order.dtos';
import { getOrderNumber } from '../../utils/order.utils';
import { PromoCodeRepositoryService } from '../promo-code/promo-code-repository.service';
import { TemplateService } from '../template.service';

export class OrderService {
  public constructor(
    protected promoCodeRepositoryService: PromoCodeRepositoryService = new PromoCodeRepositoryService(),
    protected repository: Repository<Order> = getRepository(Order),
    protected templateService: TemplateService = new TemplateService()
  ) {}

  public async createOrder(orderCreateRequestDto: OrderCreateRequestDto): Promise<Order> {
    let order: Order = fromOrderCreateRequestDto(orderCreateRequestDto);

    // ----------------------------------------

    order.status = Status.PaymentWait;
    order.uuid = uuidv4();
    order.number = getOrderNumber();

    await this.handlePromoCode(order, orderCreateRequestDto);
    await this.handleEmail(order);

    order.orderItems.forEach((orderItem: OrderItem): void => {
      orderItem.name = 'dua';
    });

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

  protected async handleEmail(order: Order): Promise<void> {
    order.emails = [
      new Email()
        .setTo(order.email)
        .setSubject(this.templateService.getOrderEmailSubject(order))
        .setHtml(this.templateService.getOrderEmailHtml(order))
    ];
  }

  protected async handlePromoCode(order: Order, orderCreateRequestDto: OrderCreateRequestDto): Promise<void> {
    if (orderCreateRequestDto.promoCode) {
      const promoCode: PromoCode = await this.promoCodeRepositoryService.getActivePromoCode(
        orderCreateRequestDto.promoCode.name
      );

      if (this.isPromoCodeDtoEqualToDb(promoCode, orderCreateRequestDto.promoCode)) {
        order.promoCode = promoCode;
      } else {
        throw `Invalid promo code`;
      }
    }
  }

  protected isPromoCodeDtoEqualToDb(
    promoCode: PromoCode,
    orderCreateRequestPromoCodeDto: OrderCreateRequestPromoCodeDto
  ): boolean {
    return promoCode && promoCode.percentageDiscount === orderCreateRequestPromoCodeDto.percentageDiscount;
  }
}
