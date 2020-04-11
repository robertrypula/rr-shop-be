import { getSecretConfig, ORDER_PAYMENT_RETURN_URL } from '../../config';
import { Order } from '../../entity/order';
import { SecretConfig } from '../../models/models';
import { PayUOrder } from '../../models/payment.models';
import { OrderSuccess } from '../../simple-pay-u/models';
import { SimplePayU } from '../../simple-pay-u/simple-pay-u';

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
      totalAmount: order.payments[0].amount * 100,
      validityTime: 2 * 3600
    });

    return {
      orderId: orderSuccess.orderId,
      redirectUri: orderSuccess.redirectUri
    };
  }

  protected getSimplePayU(order: Order): SimplePayU {
    const secretConfig: SecretConfig = getSecretConfig();

    return new SimplePayU({
      clientId: secretConfig.payU.clientId,
      clientSecret: secretConfig.payU.clientSecret,
      continueUrl: ORDER_PAYMENT_RETURN_URL(secretConfig.payU.continueUrl, order.uuid),
      currencyCode: secretConfig.payU.currencyCode,
      environment: secretConfig.payU.environment,
      merchantPosId: secretConfig.payU.merchantPosId,
      notifyUrl: secretConfig.payU.notifyUrl,
      secondKey: secretConfig.payU.secondKey
    });
  }
}
