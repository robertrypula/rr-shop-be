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
  PRICE_WITHOUT_PROMO_CODE,
  PROMO_CODE
} from '../email-templates/default';
import { Order } from '../entity/order';
import { OrderItem } from '../entity/order-item';
import { Payment } from '../entity/payment';
import { PromoCode } from '../entity/promo-code';
import { SecretConfig } from '../models/models';
import { Status } from '../models/order.models';
import { DeliveryType, PaymentType, Type } from '../models/product.models';
import { getFormattedPrice } from '../utils/transformation.utils';

// TODO implement html template loading
// TODO check why it's not working with ts-node-dev package
// https://github.com/robertrypula/audio-network-reborn/commit/d37ea6bcdfa84ca5b325da09195bd1c9de79be31
// const DEFAULT = require('./email-templates/default.html');

export class TemplateService {
  public getOrderEmailHtml(order: Order): string {
    const message: string = [
      `<pre style="font-size: 11px; line-height: 1.1em; font-family: monospace;">`,
      `${JSON.stringify(order, null, 2)}`,
      `</pre>`
    ].join('');

    return (
      DEFAULT.replace('{{ NAME }}', order.name)
        .replace('{{ NUMBER }}', order.number)
        // .replace('{{ ORDER_URL }}', )
        .replace('{{ ORDER_ITEMS }}', this.getOrderItemsHtml(order.orderItems))
        .replace('{{ PROMO_CODE }}', this.getPromoCodeHtml(order.promoCode))
        .replace('{{ PRICE }}', this.getPriceHtml(order))
        .replace('{{ PAYMENT }}', this.getPaymentHtml(order))
        .replace('{{ DELIVERY }}', this.getDeliveryHtml(order))
    );
  }

  public getOrderEmailSubject(order: Order): string {
    const secretConfig: SecretConfig = getSecretConfig();
    const fullPrefix = `${secretConfig.gmail.subjectPrefix}Waleriana.pl - `;

    switch (order.status) {
      case Status.PaymentWait:
        return `${fullPrefix}nowe zamówienie ${order.number}`;
      case Status.PaymentCompleted:
        return `${fullPrefix}zamówienie ${order.number} zostało opłacone`;
      case Status.Shipped:
        return `${fullPrefix}paczka do zamówienia ${order.number} została wysłana`;
      case Status.ReadyForPickup:
        return `${fullPrefix}zamówienie ${order.number} gotowe do odbioru osobistego`;
      case Status.Completed:
        return `${fullPrefix}zamówienie ${order.number} zostało zakończone, dziękujemy!`;
      case Status.Cancelled:
        return `${fullPrefix}zamówienie ${order.number} zostało anulowane`;
      default:
        return `${fullPrefix}zamówienie ${order.number}`;
    }
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

  protected getPromoCodeHtml(promoCode: PromoCode): string {
    return promoCode ? PROMO_CODE.replace('{{ DISCOUNT }}', `${promoCode.percentageDiscount}`) : '';
  }

  protected getPriceHtml(order: Order): string {
    const priceSelling: string = getFormattedPrice(
      order.getPriceTotalSelling([Type.Delivery, Type.Payment, Type.Product])
    );

    return order.promoCode
      ? PRICE_WITH_PROMO_CODE.replace('{{ PRICE_TOTAL_SELLING }}', priceSelling)
      : PRICE_WITHOUT_PROMO_CODE.replace('{{ PRICE_TOTAL_SELLING }}', priceSelling);
  }

  protected getPaymentHtml(order: Order): string {
    const paymentOrderItem: OrderItem = order.getPaymentOrderItem();

    switch (paymentOrderItem.paymentType) {
      case PaymentType.BankTransfer:
        return PAYMENT_BANK_TRANSFER.replace('{{ NUMBER }}', order.number);
      case PaymentType.PayU:
        const payment: Payment =
          order.payments.length && order.payments[0].paymentType === PaymentType.PayU ? order.payments[0] : null;

        return PAYMENT_PAY_U.replace('{{ PAY_U_URL }}', payment ? payment.paymentUrl : '');
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
}
