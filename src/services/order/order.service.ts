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
    this.finalValidation(order, orderCreateRequestDto);
    await this.handlePayment(order, orderCreateRequestDto);
    await this.handleEmail(order);

    return await this.orderRepositoryService.save(order); // TypeORM already wraps cascade insert with transaction
  }

  protected finalValidation(order: Order, orderCreateRequestDto: OrderCreateRequestDto): void {
    // TODO check: parcelLocker, amount of delivery and payment order items,
    throw `Not good - TODO implement me`;
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
    const productIds: number[] = order.orderItems.map((orderOrder: OrderItem): number => orderOrder.productId);
    const products: Product[] = await this.productService.getProductsFetchTypeMedium(productIds);

    if (productIds.length !== products.length) {
      throw 'Some products from the order could not be found in database';
    }

    order.orderItems.forEach((orderItem: OrderItem): void => {
      const foundProduct: Product = products.find((product: Product): boolean => product.id === orderItem.productId);

      if (!foundProduct) {
        // actually it was already checked before by unique check in validator and length check above
        throw 'Could not find product from order in the database';
      }

      orderItem.name = foundProduct.name;
      orderItem.priceUnitOriginal = foundProduct.priceUnit;
      orderItem.priceUnitSelling = null;
      // orderItem.quantity = null; ALREADY SET
      orderItem.type = foundProduct.type;
      orderItem.deliveryType = foundProduct.deliveryType;
      orderItem.paymentType = foundProduct.paymentType;

      orderItem.productId = undefined; // will be set by TypeOrm
      orderItem.product = foundProduct;
    });
  }

  protected async handlePayment(order: Order, orderCreateRequestDto: OrderCreateRequestDto): Promise<void> {
    return null;
  }

  protected async handlePromoCode(order: Order, orderCreateRequestDto: OrderCreateRequestDto): Promise<void> {
    if (orderCreateRequestDto.promoCode) {
      const name: string = orderCreateRequestDto.promoCode.name;
      const promoCode: PromoCode = await this.promoCodeRepositoryService.getActivePromoCode(name);

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
