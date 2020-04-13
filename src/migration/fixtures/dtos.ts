import { StructuralNode } from '../../models/category.models';
import { DeliveryType, PaymentType } from '../../models/product.models';

export interface CategoryTsvRow {
  structuralNode: StructuralNode;
  isNotClickable: boolean;
  isWithoutProducts: boolean;
  isInternal: boolean;
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
  isHidden: boolean;
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
