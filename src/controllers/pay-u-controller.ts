import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';

import { getSecretConfig } from '../config';
import { Category } from '../entity/category';
import { fileLogger } from '../logs/file-logger';
import { SecretConfig } from '../models/models';
import { Headers, Notification } from '../simple-pay-u/models';
import { SimplePayU } from '../simple-pay-u/simple-pay-u';
import { getOrderNumber } from '../utils/order.utils';
import { reStringifyPretty, stringifyPretty } from '../utils/utils';

export class PayUController {
  public constructor(protected repository: Repository<Category> = getRepository(Category)) {}

  public async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const email = 'robert.rypula@gmail.com';
      const extOrderId: string = getOrderNumber();
      const simplePayU: SimplePayU = this.getSimplePayU();
      const orderResponse = await simplePayU.createOrder({
        buyer: {
          email,
          firstName: 'ółżźć℥',
          language: 'pl',
          lastName: 'Rypuła ⦻',
          phone: '+48 000 111 222'
        },
        customerIp: req.ip,
        extOrderId,
        totalAmount: 50,
        validityTime: 2 * 3600
      });

      res.send(`
       <pre>${JSON.stringify(orderResponse, null, 2)}</pre>
       <a href="${orderResponse.redirectUri}">place order</a>
      `);
    } catch (error) {
      res.send(error);
    }
  }

  public async notify(req: Request, res: Response): Promise<void> {
    let notification: Notification;
    let notificationError: string;
    let logError: string;

    try {
      const simplePayU: SimplePayU = this.getSimplePayU();

      notification = simplePayU.getNotification(req.headers as Headers, req.body);
    } catch (error) {
      notificationError = error;
    }

    try {
      this.logNotifyToFile(req, notification, notificationError);
    } catch (error) {
      logError = error;
    }

    res.contentType('application/json').send(JSON.stringify({ notification, notificationError, logError }));
  }

  protected logNotifyToFile(req: Request, notification: Notification, notificationError: string): void {
    fileLogger(
      [
        ...[req.body, reStringifyPretty(req.body), stringifyPretty(req.headers)],
        ...[stringifyPretty(notification), notificationError]
      ].join('\n\n----\n\n'),
      'payUNotify'
    );
  }

  protected getSimplePayU(): SimplePayU {
    const secretConfig: SecretConfig = getSecretConfig();

    return new SimplePayU({
      clientId: secretConfig.payU.clientId,
      clientSecret: secretConfig.payU.clientSecret,
      continueUrl: secretConfig.payU.continueUrl, // TODO it would be good to generate link directly to clients order
      currencyCode: secretConfig.payU.currencyCode,
      environment: secretConfig.payU.environment,
      merchantPosId: secretConfig.payU.merchantPosId,
      notifyUrl: secretConfig.payU.notifyUrl,
      secondKey: secretConfig.payU.secondKey
    });
  }
}
