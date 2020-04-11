import { v4 as uuidv4 } from 'uuid';

import { Email } from '../../entity/email';
import { Order } from '../../entity/order';
import { OrderItem } from '../../entity/order-item';
import { Product } from '../../entity/product';
import { PromoCode } from '../../entity/promo-code';
import { fromOrderCreateRequestDto } from '../../mappers/order.mappers';
import { Status } from '../../models/order.models';
import { Type } from '../../models/product.models';
import {
  OrderCreateRequestDto,
  OrderCreateRequestOrderItemDto,
  OrderCreateRequestPromoCodeDto
} from '../../rest-api/order/order.dtos';
import { getOrderNumber } from '../../utils/order.utils';
import { getFormattedPrice, getMap } from '../../utils/transformation.utils';
import { ProductService } from '../product/product.service';
import { PromoCodeRepositoryService } from '../promo-code/promo-code-repository.service';
import { TemplateService } from '../template.service';
import { OrderRepositoryService } from './order-repository.service';

export class OrderService {
  public constructor(
    protected promoCodeRepositoryService: PromoCodeRepositoryService = new PromoCodeRepositoryService(),
    protected orderRepositoryService: OrderRepositoryService = new OrderRepositoryService(),
    protected templateService: TemplateService = new TemplateService(),
    protected productService: ProductService = new ProductService()
  ) {}

  public async createOrder(orderCreateRequestDto: OrderCreateRequestDto): Promise<Order> {
    const order: Order = fromOrderCreateRequestDto(orderCreateRequestDto);

    order.status = Status.PaymentWait;
    order.uuid = uuidv4();
    order.number = getOrderNumber();

    await this.handlePromoCode(order, orderCreateRequestDto);
    await this.handleOrderItems(order, orderCreateRequestDto);
    this.validateOrder(order, orderCreateRequestDto);
    await this.handlePayment(order, orderCreateRequestDto);
    await this.handleEmail(order);

    return await this.orderRepositoryService.save(order); // TypeORM already wraps cascade insert with transaction
  }

  protected async handleEmail(order: Order): Promise<void> {
    order.emails = [
      new Email()
        .setTo(order.email)
        .setSubject(this.templateService.getOrderEmailSubject(order))
        .setHtml(this.templateService.getOrderEmailHtml(order))
    ];
  }

  protected async handleOrderItems(order: Order, orderCreateRequestDto: OrderCreateRequestDto): Promise<void> {
    // TODO investigate locking: https://stackoverflow.com/questions/17431338/optimistic-locking-in-mysql
    const productIds: number[] = orderCreateRequestDto.orderItems.map(
      (orderCreateRequestOrderItemDto: OrderCreateRequestOrderItemDto): number =>
        orderCreateRequestOrderItemDto.productId
    );
    const products: Product[] = await this.productService.getProductsFetchTypeFull(productIds);
    const productsMap: { [key: string]: Product } = getMap(products);

    order.orderItems = [];
    orderCreateRequestDto.orderItems.forEach((orderCreateRequestOrderItemDto: OrderCreateRequestOrderItemDto): void => {
      const foundProduct: Product = productsMap[`${orderCreateRequestOrderItemDto.productId}`];
      const orderItem: OrderItem = new OrderItem();

      if (!foundProduct) {
        throw 'Could not find product from order in the database';
      }

      orderItem.order = order; // required at selling price calculation (promoCode is in order)
      orderItem.name = foundProduct.name;
      orderItem.priceUnitOriginal = foundProduct.priceUnit;
      orderItem.priceUnitSelling = orderItem.getCalculatedPriceUnitSelling();
      orderItem.quantity = orderCreateRequestOrderItemDto.quantity;
      orderItem.type = foundProduct.type;
      orderItem.deliveryType = foundProduct.deliveryType;
      orderItem.paymentType = foundProduct.paymentType;

      orderItem.product = foundProduct;

      orderItem.order = undefined; // leave relations to TypeOrm...

      this.validateOrderItem(orderItem, orderCreateRequestOrderItemDto);

      order.orderItems.push(orderItem);
    });
  }

  protected async handlePayment(order: Order, orderCreateRequestDto: OrderCreateRequestDto): Promise<void> {
    return null;
  }

  protected async handlePromoCode(order: Order, orderCreateRequestDto: OrderCreateRequestDto): Promise<void> {
    if (orderCreateRequestDto.promoCode) {
      const name: string = orderCreateRequestDto.promoCode.name;
      const promoCode: PromoCode = await this.promoCodeRepositoryService.getActivePromoCode(name);

      this.validatePromoCode(promoCode, orderCreateRequestDto.promoCode);
      order.promoCode = promoCode;
    }
  }

  protected validateOrder(order: Order, orderCreateRequestDto: OrderCreateRequestDto): void {
    // TODO check: parcelLocker, amount of delivery and payment order items,
    // throw `Not good - TODO implement me`;
  }

  protected validateOrderItem(
    orderItem: OrderItem,
    orderCreateRequestOrderItemDto: OrderCreateRequestOrderItemDto
  ): void {
    const availableQuantity: number = orderItem.product.quantity;
    const name: string = orderItem.product.name;
    const quantity: number = orderItem.quantity;

    if (orderItem.type === Type.Product && quantity > availableQuantity) {
      throw `Requested quantity (${quantity}) for product '${name}' exceeds available quantity (${availableQuantity})`;
    }

    if (orderItem.type === Type.Delivery && quantity !== 1) {
      throw `Quantity of Delivery should be always equal to 1`;
    }

    if (orderItem.type === Type.Payment && quantity !== 1) {
      throw `Quantity of Payment should be always equal to 1`;
    }

    if (
      getFormattedPrice(orderCreateRequestOrderItemDto.priceUnitOriginal) !==
      getFormattedPrice(orderItem.priceUnitOriginal)
    ) {
      throw `Original unit price of '${name}' sent in request (${orderCreateRequestOrderItemDto.priceUnitOriginal}) ` +
        `is different than the product's unit price on the server (${orderItem.priceUnitOriginal})`;
    }

    if (
      getFormattedPrice(orderCreateRequestOrderItemDto.priceUnitSelling) !==
      getFormattedPrice(orderItem.priceUnitSelling)
    ) {
      throw `Selling unit price of '${name}' sent in request (${orderCreateRequestOrderItemDto.priceUnitSelling}) ` +
        `is different than the product's unit price calculated on the server (${orderItem.priceUnitSelling})`;
    }
  }

  protected validatePromoCode(
    promoCode: PromoCode,
    orderCreateRequestPromoCodeDto: OrderCreateRequestPromoCodeDto
  ): void {
    if (!promoCode || promoCode.percentageDiscount !== orderCreateRequestPromoCodeDto.percentageDiscount) {
      throw `Invalid promo code`;
    }
  }
}
