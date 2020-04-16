import { getSecretConfig } from '../config';
import { footerImage001Cid } from '../email-templates/default';
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
      .replace('{{ NAME }}', order.name)
      .replace('{{ NUMBER }}', order.number)
      // .replace('{{ ORDER_URL }}', )
      .replace('{{ ORDER_ITEMS }}', await this.getOrderItemsHtml(order.orderItems))
      .replace('{{ COMMENTS }}', order.comments)
      .replace('{{ PRICE }}', await this.getPriceHtml(order))
      .replace('{{ PAYMENT }}', await this.getPaymentHtml(order))
      .replace('{{ DELIVERY }}', await this.getDeliveryHtml(order));

    return (await this.getContent(EmailTemplate.EmailRoot))
      .replace('{{ FOOTER_IMAGE_001_CID }}', footerImage001Cid)
      .replace('{{ MESSAGE }}', message);
  }

  public async getOrderEmailSubject(order: Order): Promise<string> {
    const secretConfig: SecretConfig = getSecretConfig();
    let subject: string = '';

    switch (order.status) {
      case Status.PaymentWait:
        subject = await this.getContent(EmailTemplate.EmailSubjectPaymentWait);
        break;
      case Status.PaymentCompleted:
        subject = await this.getContent(EmailTemplate.EmailSubjectPaymentCompleted);
        break;
      case Status.Shipped:
        subject = await this.getContent(EmailTemplate.EmailSubjectShipped);
        break;
      case Status.ReadyForPickup:
        subject = await this.getContent(EmailTemplate.EmailSubjectReadyForPickup);
        break;
      case Status.Completed:
        subject = await this.getContent(EmailTemplate.EmailSubjectCompleted);
        break;
      case Status.Canceled:
        subject = await this.getContent(EmailTemplate.EmailSubjectCanceled);
        break;
      default:
        throw 'Unsupported order status in getOrderEmailSubject';
    }

    return (
      secretConfig.gmail.subjectPrefix + removeNewlinesCharacters(subject.replace('{{ ORDER_NUMBER }}', order.number))
    );
  }

  protected async getOrderEmailMessage(order: Order): Promise<string> {
    switch (order.status) {
      case Status.PaymentWait:
        return this.getContent(EmailTemplate.EmailMessagePaymentWait);
      case Status.PaymentCompleted:
        return this.getContent(EmailTemplate.EmailMessagePaymentCompleted);
      case Status.Shipped:
        return this.getContent(EmailTemplate.EmailMessageShipped);
      case Status.ReadyForPickup:
        return this.getContent(EmailTemplate.EmailMessageReadyForPickup);
      case Status.Completed:
        return this.getContent(EmailTemplate.EmailMessageCompleted);
      case Status.Canceled:
        return this.getContent(EmailTemplate.EmailMessageCanceled);
      default:
        throw 'Unsupported order status in getOrderEmailMessage';
    }
  }

  protected async getOrderItemsHtml(orderItems: OrderItem[]): Promise<string> {
    const productTemplate: string = await this.getContent(EmailTemplate.EmailOrderItemProduct);
    const deliveryAndPaymentTemplate: string = await this.getContent(EmailTemplate.EmailOrderItemDeliveryAndPayment);
    let html = '';

    orderItems.forEach((orderItem: OrderItem, index: number): void => {
      html += (orderItem.type === Type.Product ? productTemplate : deliveryAndPaymentTemplate)
        .replace('{{ COUNTER }}', `${index + 1}`)
        .replace('{{ NAME }}', orderItem.name)
        .replace('{{ PRICE_UNIT_ORIGINAL }}', getFormattedPrice(orderItem.priceUnitOriginal))
        .replace('{{ QUANTITY }}', `${orderItem.quantity}`)
        .replace('{{ PRICE_TOTAL_ORIGINAL }}', getFormattedPrice(orderItem.getPriceTotalOriginal()));
    });

    return html;
  }

  protected async getPaymentHtml(order: Order): Promise<string> {
    const paymentOrderItem: OrderItem = order.getPaymentOrderItem();
    const payment: Payment = order.payments && order.payments.length ? order.payments[0] : null;

    switch (paymentOrderItem.paymentType) {
      case PaymentType.BankTransfer:
        return (await this.getContent(EmailTemplate.EmailPaymentBankTransfer)).replace('{{ NUMBER }}', order.number);
      case PaymentType.PayU:
        return (await this.getContent(EmailTemplate.EmailPaymentPayU))
          .replace('{{ PAY_U_URL }}', payment ? payment.url : '')
          .trim();
    }

    return '';
  }

  protected async getPriceHtml(order: Order): Promise<string> {
    const priceTotalSelling: string = getFormattedPrice(
      order.getPriceTotalSelling([Type.Delivery, Type.Payment, Type.Product])
    );

    return order.promoCode
      ? (await this.getContent(EmailTemplate.EmailPriceWithPromoCode))
          .replace('{{ DISCOUNT }}', `${order.promoCode.percentageDiscount}`)
          .replace('{{ PRICE_TOTAL_SELLING }}', priceTotalSelling)
      : (await this.getContent(EmailTemplate.EmailPriceWithoutPromoCode))
          .replace('{{ PRICE_TOTAL_SELLING }}', priceTotalSelling)
          .trim();
  }

  protected async getDeliveryHtml(order: Order): Promise<string> {
    const deliveryOrderItem: OrderItem = order.getDeliveryOrderItem();

    switch (deliveryOrderItem.deliveryType) {
      case DeliveryType.InPostCourier:
        return (await this.getContent(EmailTemplate.EmailDeliveryInPostCourier))
          .replace('{{ NAME }}', order.name)
          .replace('{{ SURNAME }}', order.surname)
          .replace('{{ ADDRESS }}', order.address)
          .replace('{{ ZIP_CODE }}', order.zipCode)
          .replace('{{ CITY }}', order.city);
      case DeliveryType.InPostParcelLocker:
        return (await this.getContent(EmailTemplate.EmailDeliveryInPostParcelLocker))
          .replace('{{ PARCEL_LOCKER }}', order.parcelLocker)
          .trim();
      case DeliveryType.Own:
        return await this.getContent(EmailTemplate.EmailDeliveryOwn);
    }

    return '';
  }

  protected async getContent(emailTemplate: EmailTemplate): Promise<string> {
    const templatesMap: TemplatesMap = await this.getTemplatesMap();
    const content: string = templatesMap[emailTemplate];

    if (!content) {
      throw `Could not load ${emailTemplate}`;
    }

    return content;
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
