// PayU code heavily simplified and migrated to TypeScript from vanilla JavaScript implementation:
// https://github.com/adambuczek/node-payu

// TODO fix disabled tslint issues
/*tslint:disable:no-console*/
/*tslint:disable:object-literal-sort-keys*/

import * as md5 from 'md5';
import { resolve } from 'path';
import { post } from 'request-promise-native';
import { Environment, Settings } from './models';

export class SimplePayU {
  protected baseUrl: string;
  protected settings: Settings;

  public constructor(settings: Settings) {
    // https://github.com/webpack/webpack/issues/1599#issuecomment-186841345
    console.log(__dirname);
    console.log(resolve(__dirname, 'test/file.txt'));
    this.settings = { ...settings };
    this.baseUrl =
      settings.environment === Environment.Production ? 'https://secure.payu.com' : 'https://secure.snd.payu.com';
  }

  public handleNotification(headers, body) {
    return this.isSignatureValid(headers, body) ? JSON.parse(body) : null;
  }

  public async order(order: any) {
    const auth = await this.authorize();
    const body = {
      continueUrl: this.settings.continueUrl,
      currencyCode: this.settings.currencyCode,
      merchantPosId: this.settings.merchantPosId,
      notifyUrl: this.settings.notifyUrl,
      buyer: {
        email: order.client.email,
        firstName: order.client.firstName,
        language: order.client.language,
        lastName: order.client.lastName,
        phone: order.client.phone
      },
      customerIp: order.customerIp,
      description: order.extOrderId,
      extOrderId: order.extOrderId,
      products: [{ name: '-', unitPrice: order.totalAmount, quantity: 1 }],
      totalAmount: order.totalAmount,
      validityTime: order.validityTime
    };
    const headers: any = {
      authorization: `Bearer ${auth}`,
      'content-type': 'application/json'
    };

    console.log('-----');
    console.log(order);
    console.log(headers);
    console.log(body);
    console.log('-----');

    try {
      return await post({
        url: this.baseUrl + '/api/v2_1/orders/',
        headers,
        body,
        simple: false,
        json: true
      });
    } catch (error) {
      console.log(error);
    }
  }

  protected async authorize(): Promise<string> {
    const now: number = Math.floor(Date.now() / 1000);
    const cacheLocation = '.cache';
    let auth: any;

    try {
      auth = false; // (existsSync(cacheLocation)) ? JSON.parse(readFileSync(cacheLocation, 'utf8')) : false;
      if (!auth || now >= auth.expires_at) {
        const response = JSON.parse(
          await post({
            url: this.baseUrl + '%$#/pl/standard/user/oauth/authorize',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            body: [
              `grant_type=client_credentials`,
              `client_id=${this.settings.clientId}`,
              `client_secret=${this.settings.clientSecret}`
            ].join('&'),
            simple: false
          })
        );
        auth = {
          ...response,
          expired_at: now + auth.expires_in
        };
        // writeFileSync(cacheLocation, JSON.stringify(auth), 'utf8');
        console.log(response);
      }

      return auth.access_token;
    } catch (e) {
      console.log(e);
    }
  }

  protected isSignatureValid(headers, body) {
    const incoming = headers['openpayu-signature'].split(';').reduce((a, c) => {
      const tmp = c.split('=');
      a[tmp[0]] = tmp[1];
      return a;
    }, {});

    // https://github.com/PayU-EMEA/openpayu_php/blob/3bda67328f95caf8f7b7a3fd2e8c2dd11ab463be/lib/OpenPayU/Util.php#L99
    if (incoming.algorithm.toLowerCase() !== 'md5') {
      throw new Error(`Unsupported hashing algorithm: ${incoming.algorithm}`);
    }

    return incoming.signature === md5(body + this.settings.secondKey);
  }
}
