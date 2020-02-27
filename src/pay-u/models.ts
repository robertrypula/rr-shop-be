export enum Environment {
  Production = 'Production',
  Sandbox = 'Sandbox'
}

export enum Status {
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED',
  NEW = 'NEW',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  WAITING_FOR_CONFIRMATION = 'WAITING_FOR_CONFIRMATION'
}

export interface Headers {
  [key: string]: string;
}

export interface Settings {
  clientId: string;
  clientSecret: string;
  continueUrl: string;
  currencyCode: string;
  environment: Environment;
  merchantPosId: string;
  notifyUrl: string;
  secondKey: string;
}

export interface SignatureBag {
  algorithm: string;
  sender: string;
  signature: string;
}

export interface OrderRequestBody {
  continueUrl: string;
  currencyCode: string;
  merchantPosId: string;
  notifyUrl: string;
  buyer: {
    email: string;
    firstName: string;
    language: string;
    lastName: string;
    phone: string;
  };
  customerIp: string;
  description: string;
  extOrderId: string;
  products: [{ name: string; unitPrice: number; quantity: number }];
  totalAmount: number;
  validityTime: number;
}

export interface OrderSuccessResponse {
  extOrderId: string;
  orderId: string;
  redirectUri: string;
}

export interface Order {
  buyer: {
    email: string;
    firstName: string;
    language: string;
    lastName: string;
    phone: string;
  };
  customerIp: string;
  extOrderId: string;
  totalAmount: number;
  validityTime: number;
}

/*
{
  "status": {
    "statusCode": "ERROR_VALUE_INVALID",
    "severity": "ERROR",
    "code": "8020",
    "codeLiteral": "INVALID_TOTAL_AMOUNT",
    "statusDesc": "Invalid field value"
  }
}

{
  "status": {
    "statusCode": "SUCCESS"
  },
  "redirectUri": "https://merch-prod.snd.payu.com/pay/?orderId=",
  "orderId": "MGFNQDMX1R200227GUEST000P01",
  "extOrderId": "WA-489-726"
}
 */
