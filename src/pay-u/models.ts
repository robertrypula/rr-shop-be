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
