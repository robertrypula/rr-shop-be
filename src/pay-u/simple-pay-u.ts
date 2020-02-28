// PayU code heavily simplified and migrated to TypeScript from vanilla JavaScript implementation:
// https://github.com/adambuczek/node-payu

// TODO fix disabled tslint issues
/*tslint:disable:no-console*/
/*tslint:disable:object-literal-sort-keys*/

import { resolve } from 'path';
import { post } from 'request-promise-native';
import { toAuthorizeSuccess, toOrderRequest, toOrderSuccess } from './mappers';
import {
  AuthorizeSuccess,
  Environment,
  GrantType,
  Headers,
  OrderBag,
  OrderRequest,
  OrderSuccess,
  Settings
} from './models';
import { isSignatureValid } from './utils';

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

  public async authorize(): Promise<AuthorizeSuccess> {
    try {
      return toAuthorizeSuccess(
        await post({
          url: this.baseUrl + '/pl/standard/user/oauth/authorize',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          body: [
            `grant_type=${GrantType.ClientCredentials}`,
            `client_id=${this.settings.clientId}`,
            `client_secret=${this.settings.clientSecret}`
          ].join('&')
        })
      );
    } catch (error) {
      throw new Error(`Cannot get access token due to: ${error}`);
    }
  }

  public async createOrder(orderBag: OrderBag): Promise<OrderSuccess> {
    try {
      const authorizeSuccess: AuthorizeSuccess = await this.authorize();
      const orderRequest: OrderRequest = toOrderRequest(orderBag, this.settings);

      console.log('-----');
      console.log(orderBag);
      console.log(orderRequest);
      console.log('-----');

      return toOrderSuccess(
        await post({
          url: this.baseUrl + '/api/v2_1/orders/',
          headers: { authorization: `Bearer ${authorizeSuccess.accessToken}`, 'content-type': 'application/json' },
          body: JSON.stringify(orderRequest),
          simple: false
        })
      );
    } catch (error) {
      throw new Error(`Cannot create order due to: ${error}`);
    }
  }

  public getNotification(headers: Headers, body) {
    try {
      return isSignatureValid(headers, body, this.settings.secondKey) ? JSON.parse(body) : null;
    } catch (error) {
      return null;
    }
  }
}
