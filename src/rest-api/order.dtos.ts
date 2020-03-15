import { Type } from '../models/order.model';

export interface OrderCreateRequestOrderItemsDto {
  priceUnitOriginal: number;
  priceUnitSelling: number;
  productId: number;
  quantity: number;
  type: Type;
}

export interface OrderCreateRequestDto {
  orderItems: OrderCreateRequestOrderItemsDto[];
  priceTotal: number;
  priceTotalDelivery: number;
  priceTotalPayment: number;
  priceTotalProduct: number;
  quantityTotalProduct: number;
}
