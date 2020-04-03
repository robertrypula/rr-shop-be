import { StructuralNode } from '../../models/category.model';

export interface CategoryTsvRow {
  structuralNode: StructuralNode;
  isUnAccessible: boolean;
  contentFilename: string;
  tree: string[];
}

export interface DescriptionMdFile {
  description: string;
  manufacturer: string;
  name: string;
}

export interface MainTsvRow {
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
