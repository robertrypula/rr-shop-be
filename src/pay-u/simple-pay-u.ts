import { post } from 'request-promise-native';

import { API_AUTHORIZE, API_ORDERS, BASE_URL_PRODUCTION, BASE_URL_SANDBOX } from './constants';
import { toAuthorizeSuccess, toNotification, toOrderRequest, toOrderSuccess } from './mappers';
import * as fromModels from './models';

// Inspired by vanilla JavaScript implementation: https://github.com/adambuczek/node-payu

export class SimplePayU {
  protected baseUrl: string;
  protected settings: fromModels.Settings;

  public constructor(settings: fromModels.Settings) {
    this.settings = { ...settings };
    this.baseUrl = settings.environment === fromModels.Environment.Production ? BASE_URL_PRODUCTION : BASE_URL_SANDBOX;
  }

  public async authorize(): Promise<fromModels.AuthorizeSuccess> {
    try {
      return toAuthorizeSuccess(
        await post({
          body: [
            `grant_type=${fromModels.GrantType.ClientCredentials}`,
            `client_id=${this.settings.clientId}`,
            `client_secret=${this.settings.clientSecret}`
          ].join('&'),
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          simple: false,
          url: this.baseUrl + API_AUTHORIZE
        })
      );
    } catch (error) {
      throw `Cannot get access token due to: [${error}]`;
    }
  }

  public async createOrder(orderBag: fromModels.OrderBag): Promise<fromModels.OrderSuccess> {
    try {
      const authorizedHeaders: fromModels.Headers = await this.getAuthorizedHeader();
      const orderRequest: fromModels.OrderRequest = toOrderRequest(orderBag, this.settings);

      return toOrderSuccess(
        await post({
          body: JSON.stringify(orderRequest),
          headers: { ...authorizedHeaders, 'content-type': 'application/json' },
          simple: false,
          url: this.baseUrl + API_ORDERS
        })
      );
    } catch (error) {
      throw `Cannot create order due to: [${error}]`;
    }
  }

  public getNotification(headers: fromModels.Headers, responseBody: string): fromModels.Notification {
    try {
      return toNotification(headers, responseBody, this.settings.secondKey);
    } catch (error) {
      throw `Cannot get notification due to: [${error}]`;
    }
  }

  protected async getAuthorizedHeader(): Promise<fromModels.Headers> {
    try {
      const authorizeSuccess: fromModels.AuthorizeSuccess = await this.authorize();

      return { authorization: `Bearer ${authorizeSuccess.accessToken}` };
    } catch (error) {
      throw `Cannot get authorized header due to: [${error}]`;
    }
  }
}
