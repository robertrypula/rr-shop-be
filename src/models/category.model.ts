export enum StructuralNode {
  Delivery = 'Delivery',
  Footer = 'Footer',
  FooterMap = 'FooterMap',
  Header = 'Header',
  Payment = 'Payment',
  ShopCategories = 'ShopCategories'
}

export interface CategoryFixture {
  name: string;
  slug?: string;
  content?: string;
  isUnAccessible?: boolean;
  structuralNode?: StructuralNode;
  children?: CategoryFixture[];
}
