import { Environment } from './pay-u/models';

export enum Status {
  PaymentWait = 'PaymentWait',
  PaymentCompleted = 'PaymentCompleted',
  Shipped = 'Shipped',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

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

export type ProductFixture = [[string, string, number, number, string], string[], string[], string];
