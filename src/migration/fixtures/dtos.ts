import { StructuralNode } from '../../models/category.model';
import { DeliveryType, PaymentType } from '../../models/product.model';

export interface CategoryTsvRow {
  structuralNode: StructuralNode;
  isUnAccessible: boolean;
  isWithoutProducts: boolean;
  contentFilename: string;
  tree: string[];
}

export interface DescriptionMdFile {
  description: string;
  manufacturer: string;
  name: string;
}

export interface MainTsvRow {
  deliveryType: DeliveryType;
  paymentType: PaymentType;
  id: number;
  name: string;
  categoryLikeType: string;
  quantity: number;
  priceUnitNet: number;
  vat: number;
  priceUnitGross: number;
  bestBeforeDates: Date[];
  distributor: string;
  pkwiu: string;
  descriptionFilename: string;
  imageFilename: string;
  priceUnitSelling: number;
  categories: string[];
}
