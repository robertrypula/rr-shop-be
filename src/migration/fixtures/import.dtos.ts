export interface MainTsvRow {
  id: number;
  name: string;
  type: string;
  quantity: number;
  priceNet: number;
  vat: number;
  priceGross: number;
  bestBefore: string;
  supplier: string;
  pkwiu: string;
  descriptionFile: string;
  imageFile: string;
  // TODO category
}

export interface DescriptionMdFile {
  description: string;
  name: string;
  supplier: string;
}
