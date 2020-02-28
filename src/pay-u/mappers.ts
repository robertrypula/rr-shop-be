import { AuthorizeSuccess, GrantType, OrderBag, OrderRequest, OrderSuccess, Settings } from './models';

export const toAuthorizeSuccess = (response: any): AuthorizeSuccess => {
  const o: any = JSON.parse(response);

  if (!o.access_token || !o.expires_in || !o.grant_type || !o.token_type) {
    throw new Error('Missing values in the authorize response');
  }

  return {
    accessToken: o.access_token,
    expiresIn: o.expires_in,
    grantType: o.grant_type === GrantType.ClientCredentials ? GrantType.ClientCredentials : null,
    tokenType: o.token_type
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
    products: [{ name: '', unitPrice: orderBag.totalAmount, quantity: 1 }],
    totalAmount: orderBag.totalAmount,
    validityTime: orderBag.validityTime
  };
};

export const toOrderSuccess = (response: any): OrderSuccess => {
  const o: any = JSON.parse(response);

  if (o.status.statusCode !== 'SUCCESS' || !o.extOrderId || !o.orderId || !o.redirectUri) {
    throw new Error('Missing or wrong values in the order response');
  }

  return {
    extOrderId: o.extOrderId,
    orderId: o.orderId,
    redirectUri: o.redirectUri
  };
};
