export enum Status {
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED',
  NEW = 'NEW',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  WAITING_FOR_CONFIRMATION = 'WAITING_FOR_CONFIRMATION'
}

// -----------------------------------------------------------------------------
// Auth

export enum GrantType {
  ClientCredentials = 'client_credentials'
}

export interface AuthorizeSuccess {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  grantType: GrantType;
}

// -----------------------------------------------------------------------------
// Generic

export enum Environment {
  Production = 'Production',
  Sandbox = 'Sandbox'
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

// -----------------------------------------------------------------------------
// Notification

export interface Notification {
  [key: string]: string;
}

export interface SignatureBag {
  algorithm: string;
  signature: string;
}

// -----------------------------------------------------------------------------
// Order

export enum OrderResponseStatusCode {
  Success = 'SUCCESS'
}

export interface OrderRequest {
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

export interface OrderSuccess {
  extOrderId: string;
  orderId: string;
  redirectUri: string;
}

export interface OrderBag {
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
