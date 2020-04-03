export enum StructuralNode {
  BestSellers = 'BestSellers',
  Delivery = 'Delivery',
  Footer = 'Footer',
  FooterMap = 'FooterMap',
  Header = 'Header',
  News = 'News',
  Payment = 'Payment',
  Recommended = 'Recommended',
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
