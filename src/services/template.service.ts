import { getSecretConfig } from '../config';
import {
  DELIVERY_IN_POST_COURIER,
  DELIVERY_IN_POST_PARCEL_LOCKER,
  DELIVERY_OWN,
  footerImage001Cid,
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
import { getFormattedPrice, removeNewlinesCharacters } from '../utils/transformation.utils';
import { CategoryRepositoryService } from './category/category-repository.service';

export class TemplateService {
  protected templatesMapCache: TemplatesMap;

  public constructor(
    protected categoryRepositoryService: CategoryRepositoryService = new CategoryRepositoryService()
  ) {}

  public async getOrderEmailHtml(order: Order): Promise<string> {
    const message: string = (await this.getOrderEmailMessage(order))
      .replace('{{ NUMBER }}', order.number)
      // .replace('{{ ORDER_URL }}', )
      .replace('{{ ORDER_ITEMS }}', await this.getOrderItemsHtml(order.orderItems))
      .replace('{{ PRICE }}', await this.getPriceHtml(order))
      .replace('{{ PAYMENT }}', await this.getPaymentHtml(order))
      .replace('{{ DELIVERY }}', await this.getDeliveryHtml(order));

    return (await this.getOrderEmailRoot())
      .replace('{{ FOOTER_IMAGE_001_CID }}', footerImage001Cid)
      .replace('{{ MESSAGE }}', message);
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

  protected async getOrderEmailRoot(): Promise<string> {
    const templatesMap: TemplatesMap = await this.getTemplatesMap();
    const root: string = templatesMap[EmailTemplate.EmailRoot];

    if (!root) {
      throw 'Could not load email root';
    }

    return root;
  }

  protected async getOrderEmailMessage(order: Order): Promise<string> {
    const templatesMap: TemplatesMap = await this.getTemplatesMap();
    let message: string = '';

    switch (order.status) {
      case Status.PaymentWait:
        message = templatesMap[EmailTemplate.EmailMessagePaymentWait];
        break;
      case Status.PaymentCompleted:
        message = templatesMap[EmailTemplate.EmailMessagePaymentCompleted];
        break;
      case Status.Shipped:
        message = templatesMap[EmailTemplate.EmailMessageShipped];
        break;
      case Status.ReadyForPickup:
        message = templatesMap[EmailTemplate.EmailMessageReadyForPickup];
        break;
      case Status.Completed:
        message = templatesMap[EmailTemplate.EmailMessageCompleted];
        break;
      case Status.Canceled:
        message = templatesMap[EmailTemplate.EmailMessageCanceled];
        break;
    }

    if (!message) {
      throw 'Could not load email message';
    }

    return message;
  }

  protected async getOrderItemsHtml(orderItems: OrderItem[]): Promise<string> {
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

  protected async getPaymentHtml(order: Order): Promise<string> {
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

  protected async getPriceHtml(order: Order): Promise<string> {
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

  protected async getDeliveryHtml(order: Order): Promise<string> {
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
