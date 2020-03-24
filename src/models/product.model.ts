export enum LoadType {
  Minimal = 'Minimal',
  Medium = 'Medium',
  Full = 'Full'
}

export enum DeliveryType {
  Courier = 'Courier',
  Own = 'Own',
  Paczkomaty = 'Paczkomaty',
  Post = 'Post'
}

export enum PaymentType {
  BankTransfer = 'BankTransfer',
  PayU = 'PayU'
}

export type ProductFixture = [
  [string, string, number, number, string, DeliveryType, PaymentType],
  string[],
  string[],
  string
];
