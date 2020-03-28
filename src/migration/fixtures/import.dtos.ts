export interface MainTsvRow {
  id: number;
  name: string;
  categoryLikeType: string;
  quantity: number;
  priceUnitNet: number;
  vat: number;
  priceUnitGross: number;
  bestBefore: string;
  distributor: string;
  pkwiu: string;
  descriptionFilename: string;
  imageFilename: string;
  priceUnitSelling: number;
  categories: string[];
}

export interface DescriptionMdFile {
  description: string;
  manufacturer: string;
  name: string;
}
