import { Environment } from '../pay-u/models';

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
  jwt: {
    expiresIn: string;
    secret: string;
  };
  payU: {
    clientId: string;
    clientSecret: string;
    environment: Environment.Sandbox;
    merchantPosId: string;
    secondKey: string;
  };
}
