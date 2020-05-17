export interface AdminProductWriteRequestBody {
  categoryIds: number[];
  description: string;
  descriptionDelivery: string;
  distributorId: number;
  isDeliveryBlockedCourier: boolean;
  isDeliveryBlockedParcelLocker: boolean;
  isHidden: boolean;
  manufacturerId: number;
  name: string;
  nameCashRegister: string;
  notes: string;
  priceUnit: number;
  priceUnitBeforePromotion: number;
  tags: string;
}
