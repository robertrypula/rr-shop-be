import { OPEN_PAY_U_SIGNATURE_HEADER } from './constants';
import {
  AuthorizeSuccess,
  GrantType,
  Headers,
  Notification,
  NotificationOrderStatus,
  OrderBag,
  OrderRequest,
  OrderResponseStatusCode,
  OrderSuccess,
  Settings,
  SignatureBag
} from './models';
import { isSignatureValid } from './utils';

export const toAuthorizeSuccess = (responseBody: any): AuthorizeSuccess => {
  const o: any = JSON.parse(responseBody);

  if (!o.access_token || !o.expires_in || !o.grant_type || !o.token_type) {
    const details: string[] = [];

    if (o && o.error) {
      details.push(o.error);
    }
    if (o && o.error_description) {
      details.push(o.error_description);
    }

    throw `Not successful authorize response${details.length ? ` due to: [${details.join(', ')}]` : ''}`;
  }

  return {
    accessToken: o.access_token,
    expiresIn: o.expires_in,
    grantType: o.grant_type === GrantType.ClientCredentials ? GrantType.ClientCredentials : null,
    tokenType: o.token_type
  };
};

export const toNotification = (headers: Headers, body: any, secondKey: string): Notification => {
  const o: any = JSON.parse(body);

  if (!isSignatureValid(headers, body, secondKey)) {
    throw `Wrong signature`;
  }

  if (!o.order || !o.order.extOrderId) {
    throw `Missing 'order.extOrderId'`;
  }

  if (!o.order || !o.order.orderId) {
    throw `Missing 'order.orderId'`;
  }

  if (
    !o.order ||
    ![NotificationOrderStatus.CANCELED, NotificationOrderStatus.COMPLETED, NotificationOrderStatus.PENDING].includes(
      o.order.status
    )
  ) {
    throw `Missing or wrong 'order.status'`;
  }

  return {
    extOrderId: o.order.extOrderId,
    orderId: o.order.orderId,
    status: o.order.status
  };
};

export const toOrderRequest = (orderBag: OrderBag, settings: Settings): OrderRequest => {
  return {
    buyer: {
      email: orderBag.buyer.email,
      firstName: orderBag.buyer.firstName,
      language: orderBag.buyer.language,
      lastName: orderBag.buyer.lastName,
      phone: orderBag.buyer.phone
    },
    continueUrl: settings.continueUrl,
    currencyCode: settings.currencyCode,
    customerIp: orderBag.customerIp,
    description: orderBag.extOrderId,
    extOrderId: orderBag.extOrderId,
    merchantPosId: settings.merchantPosId,
    notifyUrl: settings.notifyUrl,
    products: [{ name: '-', unitPrice: orderBag.totalAmount, quantity: 1 }],
    totalAmount: orderBag.totalAmount,
    validityTime: orderBag.validityTime
  };
};

export const toOrderSuccess = (responseBody: any): OrderSuccess => {
  const o: any = JSON.parse(responseBody);

  if (o.status.statusCode !== OrderResponseStatusCode.Success || !o.extOrderId || !o.orderId || !o.redirectUri) {
    const details: string[] = [];

    if (o && o.status && o.status.statusCode) {
      details.push(o.status.statusCode);
    }
    if (o && o.status && o.status.codeLiteral) {
      details.push(o.status.codeLiteral);
    }

    throw `Not successful order response${details.length ? ` due to: [${details.join(', ')}]` : ''}`;
  }

  return {
    extOrderId: o.extOrderId,
    orderId: o.orderId,
    redirectUri: o.redirectUri
  };
};

export const toSignatureBag = (headers: Headers): SignatureBag => {
  let o: any;

  if (!headers || !headers[OPEN_PAY_U_SIGNATURE_HEADER]) {
    throw `Missing '${OPEN_PAY_U_SIGNATURE_HEADER}' header`;
  }

  o = headers[OPEN_PAY_U_SIGNATURE_HEADER].split(';').reduce((a: Headers, part: string): Headers => {
    const split: string[] = part.split('=');

    a[split[0]] = split[1];

    return a;
  }, {});

  if (!o.algorithm || !o.signature) {
    throw `Missing 'algorithm' and/or 'signature' fields in header '${headers[OPEN_PAY_U_SIGNATURE_HEADER]}'`;
  }

  return {
    algorithm: o.algorithm,
    signature: o.signature
  };
};
