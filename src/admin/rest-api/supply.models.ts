export interface AdminSupplyWriteRequestBody {
  bestBefore: string;
  isUnavailable: boolean;
  notes: string;
  priceUnitGross: number;
  productId: number;
  vat: number;
}

export interface AdminSupplyOrderItemIdWriteRequestBody {
  orderItemId: number;
}
