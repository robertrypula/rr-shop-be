import { OrderItem } from '../entity/order-item';

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
  productId: number;
  productIds: number[];
  query: string;
}

export interface ProductsOrderItems {
  [productId: number]: OrderItem[];
}

export interface ProductsSuppliesCount {
  [productId: number]: number;
}

export interface ProductQueryResult {
  id: number;
  name: string;
  manufacturerName: string;
  rating?: number;
}

export type ProductQueryResultDbMock = [number, string, string, string];

export interface ProductQueryTestVectorItem {
  input: string;
  output: {
    total: number;
    firstFewResults: string[];
  };
}
