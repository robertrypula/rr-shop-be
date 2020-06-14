import { v4 as uuidv4 } from 'uuid';

import { Email } from '../../entity/email';
import { Order } from '../../entity/order';
import { OrderItem } from '../../entity/order-item';
import { Payment } from '../../entity/payment';
import { Product } from '../../entity/product';
import { PromoCode } from '../../entity/promo-code';
import { fromOrderCreateRequestDto } from '../../mappers/order.mappers';
import * as fromOrderModels from '../../models/order.models';
import { Status } from '../../models/order.models';
import * as fromPaymentModels from '../../models/payment.models';
import { PayUOrder } from '../../models/payment.models';
import { DeliveryType, PaymentType, Type } from '../../models/product.models';
import {
  OrderCreateRequestDto,
  OrderCreateRequestOrderItemDto,
  OrderCreateRequestPromoCodeDto
} from '../../rest-api/order/order.dtos';
import { getOrderNumber } from '../../utils/order.utils';
import { getFormattedPrice, getMap } from '../../utils/transformation.utils';
import { PayUService } from '../pay-u/pay-u.service';
import { ProductService } from '../product/product.service';
import { PromoCodeRepositoryService } from '../promo-code/promo-code-repository.service';
import { TemplateService } from '../template.service';
import { OrderRepositoryService } from './order-repository.service';

export class OrderService {
  public constructor(
    protected orderRepositoryService: OrderRepositoryService = new OrderRepositoryService(),
    protected payUService: PayUService = new PayUService(),
    protected productService: ProductService = new ProductService(),
    protected promoCodeRepositoryService: PromoCodeRepositoryService = new PromoCodeRepositoryService(),
    protected templateService: TemplateService = new TemplateService()
  ) {}

  public async createOrder(orderCreateRequestDto: OrderCreateRequestDto, ip: string): Promise<Order> {
    const order: Order = fromOrderCreateRequestDto(orderCreateRequestDto);

    order.status = fromOrderModels.Status.PaymentWait;
    order.uuid = uuidv4();
    order.number = getOrderNumber();

    await this.handlePromoCode(order, orderCreateRequestDto);
    await this.handleOrderItems(order, orderCreateRequestDto);
    this.validateOrder(order, orderCreateRequestDto);
    await this.handlePayment(order, orderCreateRequestDto, ip);
    await this.handleEmail(order);

    return await this.orderRepositoryService.save(order); // TypeOrm already wraps cascade inserts with transaction
  }

  public async getOrder(uuid: string): Promise<Order> {
    return await this.orderRepositoryService.getOrder(uuid);
  }

  public async getAdminOrders(): Promise<Order[]> {
    return await this.orderRepositoryService.getAdminOrders();
  }

  public async getAdminOrder(id: number): Promise<Order> {
    return await this.orderRepositoryService.getAdminOrder(id);
  }

  public async adminChangeStatus(id: number, newStatus: Status): Promise<void> {
    const order: Order = await this.orderRepositoryService.getAdminOrder(id);
    const deliveryOrderItem: OrderItem = order.getDeliveryOrderItem();

    switch (order.status) {
      case Status.PaymentWait:
        if (newStatus !== Status.PaymentCompleted) {
          throw 'Next status after PaymentWait should be always PaymentCompleted';
        }
        break;
      case Status.PaymentCompleted:
        if (deliveryOrderItem.deliveryType === DeliveryType.Own && newStatus !== Status.ReadyForPickup) {
          throw 'When delivery type is Own then next status after PaymentCompleted and is ReadyForPickup';
        } else if (deliveryOrderItem.deliveryType !== DeliveryType.Own && newStatus !== Status.Shipped) {
          throw 'When delivery type is InPost* then next status after PaymentCompleted and is Shipped';
        }
        break;
      case Status.ReadyForPickup:
        if (![Status.Completed, Status.Canceled].includes(newStatus)) {
          throw 'Next status after ReadyForPickup should be always Completed or Canceled';
        }
        break;
      case Status.Shipped:
        if (![Status.Completed, Status.Canceled].includes(newStatus)) {
          throw 'Next status after Shipped should be always Completed or Canceled';
        }
        break;
      case Status.Completed:
        if (newStatus !== Status.Canceled) {
          throw 'Next status after Completed could be only Canceled';
        }
        break;
      case Status.Canceled:
        if (newStatus !== Status.Completed) {
          throw 'Next status after Canceled could be only Completed';
        }
        break;
    }

    // console.log(id, newStatus);
    // console.log(order);

    order.status = newStatus;
    order.emails.push(await this.createEmail(order));
    await this.orderRepositoryService.save(order);
  }

  protected async handleEmail(order: Order): Promise<void> {
    order.emails = [await this.createEmail(order)];
  }

  protected async createEmail(order: Order): Promise<Email> {
    return new Email()
      .setTo(order.email)
      .setSubject(await this.templateService.getOrderEmailSubject(order))
      .setHtml(await this.templateService.getOrderEmailHtml(order));
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

      orderItem.uuid = uuidv4();
      orderItem.order = order; // required at selling price calculation (promoCode is in order)
      orderItem.name = foundProduct.name;
      orderItem.quantity = orderCreateRequestOrderItemDto.quantity;
      orderItem.type = foundProduct.type;
      orderItem.deliveryType = foundProduct.deliveryType;
      orderItem.paymentType = foundProduct.paymentType;

      orderItem.priceUnitOriginal = foundProduct.priceUnit;
      orderItem.priceUnitSelling = orderItem.getCalculatedPriceUnitSelling();

      if (foundProduct.isUnitPriceReductionActive()) {
        orderItem.priceUnitBeforePromotionOriginal = foundProduct.priceUnitBeforePromotion;
      }

      orderItem.product = foundProduct;

      orderItem.order = undefined; // leave relations to TypeOrm...

      this.validateOrderItem(orderItem, orderCreateRequestOrderItemDto);

      order.orderItems.push(orderItem);
    });

    order.orderItems = order.orderItems.sort((a: OrderItem, b: OrderItem): number =>
      a.getSortOrder() === b.getSortOrder() ? 0 : a.getSortOrder() < b.getSortOrder() ? -1 : 1
    );
  }

  protected async handlePayment(order: Order, orderCreateRequestDto: OrderCreateRequestDto, ip: string): Promise<void> {
    const paymentOrderItem: OrderItem = order.getPaymentOrderItem();

    if (paymentOrderItem) {
      const payment: Payment = new Payment();

      order.payments = [payment];
      payment.uuid = uuidv4();
      payment.amount = order.getPriceTotalSelling([Type.Delivery, Type.Payment, Type.Product]);
      payment.status = fromPaymentModels.Status.Pending;
      payment.paymentType = paymentOrderItem.paymentType;

      if (paymentOrderItem.paymentType === PaymentType.PayU) {
        const payUOrder: PayUOrder = await this.payUService.createPayUOrder(order, ip);

        payment.externalId = payUOrder.orderId;
        payment.url = payUOrder.redirectUri;
      }
    }
  }

  protected async handlePromoCode(order: Order, orderCreateRequestDto: OrderCreateRequestDto): Promise<void> {
    if (orderCreateRequestDto.promoCode) {
      const name: string = orderCreateRequestDto.promoCode.name;
      const promoCode: PromoCode = await this.promoCodeRepositoryService.getActivePromoCode(name, true);

      this.validatePromoCode(promoCode, orderCreateRequestDto.promoCode);
      order.promoCode = promoCode;
    }
  }

  protected validateOrder(order: Order, orderCreateRequestDto: OrderCreateRequestDto): void {
    let deliveryOrderItem: OrderItem;

    if (!order.isTypeAndLengthOfOrderItemValid()) {
      throw 'Order should have one Payment, one Delivery and at least one Product';
    }

    if (!order.isDeliveryTypeBlockRuleValid()) {
      throw 'Order contains items that could not be delivered by given delivery type';
    }

    deliveryOrderItem = order.getDeliveryOrderItem();
    if (
      deliveryOrderItem &&
      deliveryOrderItem.deliveryType === DeliveryType.InPostParcelLocker &&
      !orderCreateRequestDto.parcelLocker
    ) {
      throw `Parcel Locker name missing`;
    }

    if (
      getFormattedPrice(orderCreateRequestDto.priceTotalOriginalAll) !==
      getFormattedPrice(order.getPriceTotalOriginal([Type.Delivery, Type.Payment, Type.Product]))
    ) {
      throw `In the sent request (${getFormattedPrice(orderCreateRequestDto.priceTotalOriginalAll)}) ` +
        `total original price is different than total original price calculated on the ` +
        `server (${order.getPriceTotalOriginal([Type.Delivery, Type.Payment, Type.Product])})`;
    }

    if (
      getFormattedPrice(orderCreateRequestDto.priceTotalOriginalDelivery) !==
      getFormattedPrice(order.getPriceTotalOriginal([Type.Delivery]))
    ) {
      throw `In the sent request (${getFormattedPrice(orderCreateRequestDto.priceTotalOriginalDelivery)}) ` +
        `delivery original price is different than delivery original price calculated on the ` +
        `server (${order.getPriceTotalOriginal([Type.Delivery])})`;
    }

    if (
      getFormattedPrice(orderCreateRequestDto.priceTotalOriginalPayment) !==
      getFormattedPrice(order.getPriceTotalOriginal([Type.Payment]))
    ) {
      throw `In the sent request (${getFormattedPrice(orderCreateRequestDto.priceTotalOriginalPayment)}) ` +
        `payment original price is different than payment original price calculated on the ` +
        `server (${order.getPriceTotalOriginal([Type.Payment])})`;
    }

    if (
      getFormattedPrice(orderCreateRequestDto.priceTotalOriginalProduct) !==
      getFormattedPrice(order.getPriceTotalOriginal([Type.Product]))
    ) {
      throw `In the sent request (${getFormattedPrice(orderCreateRequestDto.priceTotalOriginalProduct)}) ` +
        `product original price is different than product original price calculated on the ` +
        `server (${order.getPriceTotalOriginal([Type.Product])})`;
    }

    if (
      getFormattedPrice(orderCreateRequestDto.priceTotalSellingAll) !==
      getFormattedPrice(order.getPriceTotalSelling([Type.Delivery, Type.Payment, Type.Product]))
    ) {
      throw `In the sent request (${getFormattedPrice(orderCreateRequestDto.priceTotalSellingAll)}) ` +
        `total selling price is different than total selling price calculated on the ` +
        `server (${order.getPriceTotalSelling([Type.Delivery, Type.Payment, Type.Product])})`;
    }

    if (
      getFormattedPrice(orderCreateRequestDto.priceTotalSellingDelivery) !==
      getFormattedPrice(order.getPriceTotalSelling([Type.Delivery]))
    ) {
      throw `In the sent request (${getFormattedPrice(orderCreateRequestDto.priceTotalSellingDelivery)}) ` +
        `delivery selling price is different than delivery selling price calculated on the ` +
        `server (${order.getPriceTotalSelling([Type.Delivery])})`;
    }

    if (
      getFormattedPrice(orderCreateRequestDto.priceTotalSellingPayment) !==
      getFormattedPrice(order.getPriceTotalSelling([Type.Payment]))
    ) {
      throw `In the sent request (${getFormattedPrice(orderCreateRequestDto.priceTotalSellingPayment)}) ` +
        `payment selling price is different than payment selling price calculated on the ` +
        `server (${order.getPriceTotalSelling([Type.Payment])})`;
    }

    if (
      getFormattedPrice(orderCreateRequestDto.priceTotalSellingProduct) !==
      getFormattedPrice(order.getPriceTotalSelling([Type.Product]))
    ) {
      throw `In the sent request (${getFormattedPrice(orderCreateRequestDto.priceTotalSellingProduct)}) ` +
        `product selling price is different than product selling price calculated on the ` +
        `server (${order.getPriceTotalSelling([Type.Product])})`;
    }
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
