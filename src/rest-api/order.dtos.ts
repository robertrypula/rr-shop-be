export interface OrderCreateRequestOrderItemsDto {
  priceUnitOriginal: number;
  priceUnitSelling: number;
  productId: number;
  quantity: number;
}

export interface OrderCreateRequestPromoCodeDto {
  name: string;
  percentageDiscount: number;
}

export interface OrderCreateRequestDto {
  orderItems: OrderCreateRequestOrderItemsDto[];
  // ---
  email: string;
  phone: string;
  name: string;
  surname: string;
  address: string;
  zipCode: string;
  city: string;
  comments: string;
  // ---
  promoCode: OrderCreateRequestPromoCodeDto;
  // ---
  priceTotalOriginalAll: number;
  priceTotalOriginalDelivery: number;
  priceTotalOriginalPayment: number;
  priceTotalOriginalProduct: number;
  priceTotalSellingAll: number;
  priceTotalSellingDelivery: number;
  priceTotalSellingPayment: number;
  priceTotalSellingProduct: number;
}
