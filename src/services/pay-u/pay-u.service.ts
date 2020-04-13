import { getSecretConfig, ORDER_PAYMENT_RETURN_URL } from '../../config';
import { Order } from '../../entity/order';
import { fileLogger } from '../../logs/file-logger';
import { SecretConfig } from '../../models/models';
import { PayUOrder } from '../../models/payment.models';
import { Headers, Notification, OrderSuccess } from '../../simple-pay-u/models';
import { SimplePayU } from '../../simple-pay-u/simple-pay-u';
import { reStringifyPretty, stringifyPretty } from '../../utils/utils';

export class PayUService {
  public async createPayUOrder(order: Order, ip: string): Promise<PayUOrder> {
    const simplePayU: SimplePayU = this.getSimplePayU(order);
    const orderSuccess: OrderSuccess = await simplePayU.createOrder({
      buyer: {
        email: order.email,
        firstName: order.name,
        language: 'pl',
        lastName: order.surname,
        phone: order.phone
      },
      customerIp: ip,
      extOrderId: order.number,
      totalAmount: order.payments[0].amount * 100, // TODO refactor when multiple PayU payments will be required
      validityTime: 24 * 3600
    });

    return {
      orderId: orderSuccess.orderId,
      redirectUri: orderSuccess.redirectUri
    };
  }

  public async handleNotification(headers: Headers, body: string): Promise<void> {
    let notification: Notification;
    let errorOnParsingNotification: string;
    let errorOnLoggingToFile: string;
    let errorOnStoringToDatabase: string;

    try {
      const simplePayU: SimplePayU = this.getSimplePayU(null);

      notification = simplePayU.getNotification(headers, body);
    } catch (error) {
      errorOnParsingNotification = `${error}`;
    }

    try {
      this.logNotifyToFile(headers, body, notification, errorOnParsingNotification);
    } catch (error) {
      errorOnLoggingToFile = `${error}`;
    }

    try {
      // TODO solve circular dependency :(
      // await this.orderService.storePayUNotification(headers, body,
      // notification, errorOnParsingNotification, errorOnLoggingToFile);
      // console.log(notification);
    } catch (error) {
      errorOnStoringToDatabase = `${error}`;
    }

    if (errorOnParsingNotification || errorOnLoggingToFile || errorOnStoringToDatabase) {
      throw [
        ...(errorOnParsingNotification ? [errorOnParsingNotification] : []),
        ...(errorOnLoggingToFile ? [errorOnLoggingToFile] : []),
        ...(errorOnStoringToDatabase ? [errorOnStoringToDatabase] : [])
      ].join(' | ');
    }
  }

  protected logNotifyToFile(
    headers: Headers,
    body: string,
    notification: Notification,
    errorOnParsingNotification: string
  ): void {
    fileLogger(
      [
        ...[stringifyPretty(headers), body, reStringifyPretty(body)],
        ...[stringifyPretty(notification), errorOnParsingNotification]
      ].join('\n\n----\n\n'),
      'payUNotify'
    );
  }

  protected getSimplePayU(order: Order): SimplePayU {
    const secretConfig: SecretConfig = getSecretConfig();

    return new SimplePayU({
      clientId: secretConfig.payU.clientId,
      clientSecret: secretConfig.payU.clientSecret,
      continueUrl: ORDER_PAYMENT_RETURN_URL(secretConfig.payU.continueUrl, order ? order.uuid : ''),
      currencyCode: secretConfig.payU.currencyCode,
      environment: secretConfig.payU.environment,
      merchantPosId: secretConfig.payU.merchantPosId,
      notifyUrl: secretConfig.payU.notifyUrl,
      secondKey: secretConfig.payU.secondKey
    });
  }
}
