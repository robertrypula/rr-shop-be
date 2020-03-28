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
  // TODO category
}

export interface DescriptionMdFile {
  description: string;
  manufacturer: string;
  name: string;
}
