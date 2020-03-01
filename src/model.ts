import { Environment } from './pay-u/models';

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

export interface JwtConfig {
  expiresIn: string;
}

export interface JwtPayload {
  userId: number;
  username: string;
  iat?: number;
  exp?: number;
}

export interface PayUConfig {
  continueUrl: string;
  currencyCode: string;
  notifyUrl: string;
}

export interface SecretConfig {
  payU: {
    clientId: string;
    clientSecret: string;
    environment: Environment.Sandbox;
    merchantPosId: string;
    secondKey: string;
  };
  jwt: {
    secret: string;
  };
}

export type ProductFixture = [[string, string, number, number, string], number[], string[], string];
