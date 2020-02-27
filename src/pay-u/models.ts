export enum Environment {
  Sandbox = 'Sandbox',
  Production = 'Production'
}

export enum Status {
  NEW = 'NEW',
  PENDING = 'PENDING',
  WAITING_FOR_CONFIRMATION = 'WAITING_FOR_CONFIRMATION',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  REJECTED = 'REJECTED'
}

export interface Settings {
  posId: string;
  posDesc: string;
  posCurrency: string;
  clientId: string;
  clientSecret: string;
  signatureKey: string;
  environment: Environment;
  notifyUrl: string;
  continueUrl: string;
}
