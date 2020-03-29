import { Environment } from '../pay-u/models';

export interface JwtPayload {
  userId: number;
  username: string;
  iat?: number;
  exp?: number;
}

export interface SecretConfig {
  jwt: {
    expiresIn: string;
    secret: string;
  };
  payU: {
    clientId: string;
    clientSecret: string;
    continueUrl: string;
    currencyCode: string;
    environment: Environment.Sandbox;
    merchantPosId: string;
    notifyUrl: string;
    secondKey: string;
  };
}
