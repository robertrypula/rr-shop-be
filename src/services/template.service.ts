import { getSecretConfig } from '../config';
import {
  DEFAULT,
  DELIVERY_IN_POST_COURIER,
  DELIVERY_IN_POST_PARCEL_LOCKER,
  DELIVERY_OWN,
  ORDER_ITEM,
  PAYMENT_BANK_TRANSFER,
  PAYMENT_PAY_U,
  PRICE_WITH_PROMO_CODE,
  PRICE_WITHOUT_PROMO_CODE
} from '../email-templates/default';
import { Category } from '../entity/category';
import { Order } from '../entity/order';
import { OrderItem } from '../entity/order-item';
import { Payment } from '../entity/payment';
import { StructuralNode } from '../models/category.models';
import { SecretConfig } from '../models/models';
import { Status } from '../models/order.models';
import { DeliveryType, PaymentType, Type } from '../models/product.models';
import { EmailTemplate, TemplatesMap } from '../models/template.models';
import { getFormattedPrice, removeNewlinesCharacters, removeWhitespaceCharacters } from '../utils/transformation.utils';
import { CategoryRepositoryService } from './category/category-repository.service';

// TODO implement html template loading
// TODO check why it's not working with ts-node-dev package
// https://github.com/robertrypula/audio-network-reborn/commit/d37ea6bcdfa84ca5b325da09195bd1c9de79be31
// const DEFAULT = require('./email-templates/default.html');

export class TemplateService {
  protected templatesMapCache: TemplatesMap;

  public constructor(
    protected categoryRepositoryService: CategoryRepositoryService = new CategoryRepositoryService()
  ) {}

  public async getOrderEmailHtml(order: Order): Promise<string> {
    const templatesMap: TemplatesMap = await this.getTemplatesMap();
    console.log('------------------------------');
    console.log(templatesMap);
    console.log('------------------------------');

    return (
      DEFAULT.replace('{{ NAME }}', order.name)
        .replace('{{ NUMBER }}', order.number)
        // .replace('{{ ORDER_URL }}', )
        .replace('{{ ORDER_ITEMS }}', this.getOrderItemsHtml(order.orderItems))
        .replace('{{ PRICE }}', this.getPriceHtml(order))
        .replace('{{ PAYMENT }}', this.getPaymentHtml(order))
        .replace('{{ DELIVERY }}', this.getDeliveryHtml(order))
    );
  }

  public async getOrderEmailSubject(order: Order): Promise<string> {
    const templatesMap: TemplatesMap = await this.getTemplatesMap();
    const secretConfig: SecretConfig = getSecretConfig();
    let subject: string = '';

    switch (order.status) {
      case Status.PaymentWait:
        subject = templatesMap[EmailTemplate.EmailSubjectPaymentWait];
        break;
      case Status.PaymentCompleted:
        subject = templatesMap[EmailTemplate.EmailSubjectPaymentCompleted];
        break;
      case Status.Shipped:
        subject = templatesMap[EmailTemplate.EmailSubjectShipped];
        break;
      case Status.ReadyForPickup:
        subject = templatesMap[EmailTemplate.EmailSubjectReadyForPickup];
        break;
      case Status.Completed:
        subject = templatesMap[EmailTemplate.EmailSubjectCompleted];
        break;
      case Status.Canceled:
        subject = templatesMap[EmailTemplate.EmailSubjectCanceled];
        break;
    }

    if (!subject) {
      throw 'Could not load email subject';
    }

    return (
      secretConfig.gmail.subjectPrefix + removeNewlinesCharacters(subject.replace('{{ ORDER_NUMBER }}', order.number))
    );
  }

  protected getOrderItemsHtml(orderItems: OrderItem[]): string {
    let html = '';

    orderItems.forEach((orderItem: OrderItem, index: number): void => {
      html += ORDER_ITEM.replace('{{ COUNTER }}', `${index + 1}`)
        .replace('{{ NAME }}', orderItem.name)
        .replace('{{ PRICE_UNIT_ORIGINAL }}', getFormattedPrice(orderItem.priceUnitOriginal))
        .replace('{{ QUANTITY }}', `${orderItem.quantity}`)
        .replace('{{ PRICE_TOTAL_ORIGINAL }}', getFormattedPrice(orderItem.getPriceTotalOriginal()));
    });

    return html;
  }

  protected getPriceHtml(order: Order): string {
    const priceSelling: string = getFormattedPrice(
      order.getPriceTotalSelling([Type.Delivery, Type.Payment, Type.Product])
    );

    return order.promoCode
      ? PRICE_WITH_PROMO_CODE.replace('{{ DISCOUNT }}', `${order.promoCode.percentageDiscount}`).replace(
          '{{ PRICE_TOTAL_SELLING }}',
          priceSelling
        )
      : PRICE_WITHOUT_PROMO_CODE.replace('{{ PRICE_TOTAL_SELLING }}', priceSelling);
  }

  protected getPaymentHtml(order: Order): string {
    const paymentOrderItem: OrderItem = order.getPaymentOrderItem();

    switch (paymentOrderItem.paymentType) {
      case PaymentType.BankTransfer:
        return PAYMENT_BANK_TRANSFER.replace('{{ NUMBER }}', order.number);
      case PaymentType.PayU:
        const payment: Payment =
          order.payments && order.payments.length && order.payments[0].paymentType === PaymentType.PayU
            ? order.payments[0]
            : null;

        return PAYMENT_PAY_U.replace('{{ PAY_U_URL }}', payment ? payment.url : '');
    }

    return '';
  }

  protected getDeliveryHtml(order: Order): string {
    const deliveryOrderItem: OrderItem = order.getDeliveryOrderItem();

    switch (deliveryOrderItem.deliveryType) {
      case DeliveryType.InPostCourier:
        return DELIVERY_IN_POST_COURIER.replace('{{ NAME }}', order.name)
          .replace('{{ SURNAME }}', order.surname)
          .replace('{{ ADDRESS }}', order.address)
          .replace('{{ ZIP_CODE }}', order.zipCode)
          .replace('{{ CITY }}', order.city);
      case DeliveryType.InPostParcelLocker:
        return DELIVERY_IN_POST_PARCEL_LOCKER.replace('{{ PARCEL_LOCKER }}', order.parcelLocker);
      case DeliveryType.Own:
        return DELIVERY_OWN;
    }

    return '';
  }

  protected async getTemplatesMap(): Promise<TemplatesMap> {
    if (!this.templatesMapCache) {
      this.templatesMapCache = (await this.categoryRepositoryService.getCategoriesByStructuralNode(
        StructuralNode.EmailTemplates
      )).reduce((accumulator: TemplatesMap, current: Category): TemplatesMap => {
        accumulator[current.name] = current.content;
        return accumulator;
      }, {});
    }

    return this.templatesMapCache;
  }
}
