// PayU code heavily simplified and migrated to TypeScript from vanilla JavaScript implementation:
// https://github.com/adambuczek/node-payu

// TODO fix disabled tslint issues
/*tslint:disable:no-console*/
/*tslint:disable:object-literal-sort-keys*/

import { writeFileSync } from 'fs';
import * as md5 from 'md5';
import { resolve } from 'path';
import { post } from 'request-promise-native';

const error = (err: any) => {
  console.log(err);
};

export class SimplePayU {
  public clientId: string;
  public clientSecret: string;
  public posId: string;
  public posDesc: string;
  public posCurrency: string;
  public signatureKey: string;
  public notifyUrl: string;
  public continueUrl: string;
  public baseUrl: string;
  public hash: string;

  public constructor(settings: any) {
    // https://github.com/webpack/webpack/issues/1599#issuecomment-186841345
    console.log(__dirname);
    console.log(resolve(__dirname, 'test/file.txt'));
    this.clientId = settings.clientId;
    this.clientSecret = settings.clientSecret;
    this.posId = settings.posId;
    this.posDesc = settings.posDesc;
    this.posCurrency = settings.posCurrency;
    this.signatureKey = settings.signatureKey;
    this.notifyUrl = settings.notifyUrl;
    this.continueUrl = settings.continueUrl;
    this.baseUrl = settings.environment === 'secure' ? 'https://secure.payu.com' : 'https://secure.snd.payu.com';
    this.hash = settings.hash ? settings.hash : 'MD5';
  }

  public async authorize() {
    const now = Math.floor(Date.now() / 1000);
    const cacheLocation = '.cache';
    let auth: any;

    try {
      auth = false; // (existsSync(cacheLocation)) ? JSON.parse(readFileSync(cacheLocation, 'utf8')) : false;
      if (!auth || now >= auth.expires_at) {
        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };
        const url = '/pl/standard/user/oauth/authorize';
        const response = await post({
          url: this.baseUrl + url,
          headers,
          body: `grant_type=client_credentials&client_id=${this.clientId}&client_secret=${this.clientSecret}`
        });
        auth = JSON.parse(response);
        auth.expires_at = now + auth.expires_in;
        writeFileSync(cacheLocation, JSON.stringify(auth), 'utf8');
      }
      return auth.access_token;
    } catch (e) {
      error(e);
    }
  }

  public verifyNotification(header, body) {
    const incoming = header.split(';').reduce((a, c) => {
      const tmp = c.split('=');
      a[tmp[0]] = tmp[1];
      return a;
    }, {});
    if (incoming.algorithm !== 'MD5') {
      throw new Error(`Unsupported hashing algorithm: ${incoming.algorithm}`);
    }
    if (incoming.signature === md5(body + this.signatureKey)) {
      return true;
    }

    // https://github.com/PayU-EMEA/openpayu_php/blob/3bda67328f95caf8f7b7a3fd2e8c2dd11ab463be/lib/OpenPayU/Util.php#L99
    return false;
  }

  public handleNotification(header, body) {
    if (this.verifyNotification(header, body)) {
      const notification = JSON.parse(body);
      const status = notification.order.status;
      //   case 'NEW':
      //   case 'PENDING':
      //   case 'WAITING_FOR_CONFIRMATION':
      //   case 'COMPLETED':
      //   case 'CANCELED':
      //   case 'REJECTED':
      // }
      return {
        extOrderId: notification.order.extOrderId,
        status
      };
    }
    return false;
  }

  public async order(order: any) {
    const auth = await this.authorize();
    const url = '/api/v2_1/orders/';
    const headers: any = {};

    headers.authorization = `Bearer ${auth}`;
    headers['Content-Type'] = 'application/json';

    console.log(order);

    try {
      const requestBody = {
        extOrderId: order.extOrderId,
        notifyUrl: this.notifyUrl,
        customerIp: order.customerIp,
        merchantPosId: this.posId,
        validityTime: 3600,
        description: this.posDesc,
        currencyCode: this.posCurrency,
        totalAmount: order.products.reduce((acc, cur) => (acc += cur.unitPrice * cur.quantity), 0),
        continueUrl: this.continueUrl,
        buyer: {
          email: order.client.email,
          phone: order.client.phone,
          firstName: order.client.firstName,
          lastName: order.client.lastName,
          language: order.client.language
        },
        products: order.products
      };

      console.log('------ REQ');
      console.log(requestBody);
      console.log('------');

      const response = JSON.parse(
        await post({
          url: this.baseUrl + url,
          headers,
          body: JSON.stringify(requestBody),
          simple: false
        })
      );

      return response;
    } catch (e) {
      error(e);
    }
  }
}
