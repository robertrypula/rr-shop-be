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
  InPostCourier = 'InPostCourier',
  InPostParcelLocker = 'InPostParcelLocker',
  Own = 'Own'
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

export interface ProductsSuppliesCount {
  [productId: number]: number;
}
