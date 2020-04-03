export enum FetchType {
  Minimal = 'Minimal',
  Medium = 'Medium',
  Full = 'Full'
}

export enum Type {
  Delivery = 'Delivery',
  Payment = 'Payment',
  Product = 'Product'
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

export interface ParameterBag {
  categoryIds: number[];
  fetchType: FetchType;
  name: string;
  productId: number;
  productIds: number[];
}
