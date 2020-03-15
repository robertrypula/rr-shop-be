import { Environment } from '../pay-u/models';

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
