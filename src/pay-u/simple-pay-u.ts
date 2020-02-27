// PayU code heavily simplified and migrated to TypeScript from vanilla JavaScript implementation:
// https://github.com/adambuczek/node-payu

// TODO fix disabled tslint issues
/*tslint:disable:no-console*/
/*tslint:disable:object-literal-sort-keys*/

import * as md5 from 'md5';
import { resolve } from 'path';
import { post } from 'request-promise-native';
import * as sha1 from 'sha1';
import { Environment, Headers, Settings, SignatureBag, OrderRequestBody, Order } from './models';

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
    let result;

    try {
      result = this.isSignatureValid(headers, body) ? JSON.parse(body) : null;
    } catch (error) {
      result = null;
    }

    return result;
  }

  public async createOrder(order: Order): Promise<any> {
    // TODO update type
    const accessToken: string = await this.getAccessToken();
    const body: OrderRequestBody = {
      continueUrl: this.settings.continueUrl,
      currencyCode: this.settings.currencyCode,
      merchantPosId: this.settings.merchantPosId,
      notifyUrl: this.settings.notifyUrl,
      buyer: {
        email: order.buyer.email,
        firstName: order.buyer.firstName,
        language: order.buyer.language,
        lastName: order.buyer.lastName,
        phone: order.buyer.phone
      },
      customerIp: order.customerIp,
      description: order.extOrderId,
      extOrderId: order.extOrderId,
      products: [{ name: '-', unitPrice: order.totalAmount, quantity: 1 }],
      totalAmount: order.totalAmount,
      validityTime: order.validityTime
    };
    const headers: Headers = {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json'
    };

    console.log('-----');
    console.log(order);
    console.log(headers);
    console.log(body);
    console.log('-----');

    try {
      const response = await post({
        url: this.baseUrl + '/api/v2_1/orders/',
        headers,
        body,
        simple: false,
        json: true
      });
      return response;
    } catch (error) {
      throw new Error('');
    }
  }

  protected async getAccessToken(): Promise<string> {
    try {
      const auth = JSON.parse(
        await post({
          url: this.baseUrl + '/pl/standard/user/oauth/authorize',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          body: [
            `grant_type=client_credentials`,
            `client_id=${this.settings.clientId}`,
            `client_secret=${this.settings.clientSecret}`
          ].join('&'),
          simple: false
        })
      );

      console.log(auth);

      return auth.access_token;
    } catch (e) {
      console.log(e);
      return '';
    }
  }

  protected isSignatureValid(headers: Headers, body: string): boolean {
    const signatureBag: SignatureBag = this.getSignatureBag(headers);
    const algorithm: string = signatureBag.algorithm.toLowerCase();

    // https://github.com/PayU-EMEA/openpayu_php/blob/3bda67328f95caf8f7b7a3fd2e8c2dd11ab463be/lib/OpenPayU/Util.php#L99
    if (algorithm === 'md5') {
      return signatureBag.signature === md5(body + this.settings.secondKey);
    } else if (['sha', 'sha1', 'sha-1'].includes(algorithm)) {
      return signatureBag.signature === sha1(body + this.settings.secondKey);
    }

    throw new Error(`Unsupported hashing algorithm: ${algorithm}`);
  }

  protected getSignatureBag(headers: Headers): SignatureBag {
    const unpacked: Headers = (headers['openpayu-signature'] || '')
      .split(';')
      .reduce((a: Headers, part: string): Headers => {
        const split: string[] = part.split('=');

        a[split[0]] = split[1];

        return a;
      }, {});

    return {
      algorithm: unpacked.algrithm ? unpacked.algrithm : '',
      sender: unpacked.sender ? unpacked.sender : '',
      signature: unpacked.signature ? unpacked.signature : ''
    };
  }
}
