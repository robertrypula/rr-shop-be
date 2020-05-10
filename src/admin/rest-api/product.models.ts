export interface AdminProductWriteRequestBody {
  name: string;
  description: string;
  priceUnit: number;
  notes: string;
  isHidden: boolean;
}
