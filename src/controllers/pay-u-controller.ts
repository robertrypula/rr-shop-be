import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';

import { getSecretConfig, payUConfig } from '../config';
import { Category } from '../entity/category';
import { fileLogger } from '../logs/file-logger';
import { SecretConfig } from '../model';
import { Headers, Notification } from '../pay-u/models';
import { SimplePayU } from '../pay-u/simple-pay-u';
import { getRandomInt, reStringifyPretty } from '../utils';

export class PayUController {
  public constructor(protected repository: Repository<Category> = getRepository(Category)) {}

  public async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const simplePayU: SimplePayU = this.getSimplePayU();
      const orderResponse = await simplePayU.createOrder({
        buyer: {
          email: 'robert.rypula@gmai#@l.com',
          firstName: 'Robert',
          language: 'pl',
          lastName: 'Rypuła',
          phone: '+48 000 111 222'
        },
        customerIp: req.ip,
        extOrderId: this.getExtOrderId(),
        totalAmount: 2343,
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
    let errorToLog: string = null;

    try {
      const simplePayU: SimplePayU = this.getSimplePayU();

      notification = simplePayU.getNotification(req.headers as Headers, req.body);
      res.send(`<pre>${JSON.stringify(notification, null, 2)}</pre>`);
    } catch (error) {
      errorToLog = error;
      res.send(error);
    }

    fileLogger(
      [
        req.body,
        reStringifyPretty(req.body),
        JSON.stringify(req.headers, null, 2),
        JSON.stringify(notification, null, 2),
        errorToLog
      ].join('\n\n----\n\n'),
      'payUNotify'
    );
  }

  protected getSimplePayU(): SimplePayU {
    const secretConfig: SecretConfig = getSecretConfig();

    return new SimplePayU({
      clientId: secretConfig.payU.clientId,
      clientSecret: secretConfig.payU.clientSecret,
      continueUrl: payUConfig.continueUrl,
      currencyCode: payUConfig.currencyCode,
      environment: secretConfig.payU.environment,
      merchantPosId: secretConfig.payU.merchantPosId,
      notifyUrl: payUConfig.notifyUrl,
      secondKey: secretConfig.payU.secondKey
    });
  }

  protected getExtOrderId(): string {
    return `WA-${getRandomInt(100, 999)}-${getRandomInt(100, 999)}`;
  }
}
