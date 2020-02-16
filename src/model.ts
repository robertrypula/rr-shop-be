export enum StructuralNode {
  Footer = 'Footer',
  FooterMap = 'FooterMap',
  Header = 'Header',
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

export type JwtPayload = {
  userId: number;
  username: string;
  iat?: number;
  exp?: number;
};

export type ProductFixture = [[string, string, number, number, string], number[], string[], string];
