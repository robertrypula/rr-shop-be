export interface AdminProductWriteRequestBody {
  categoryIds: number[];
  description: string;
  distributorId: number;
  isHidden: boolean;
  manufacturerId: number;
  name: string;
  nameCashRegister: string;
  notes: string;
  priceUnit: number;
  priceUnitBeforePromotion: number;
  tags: string;
}
