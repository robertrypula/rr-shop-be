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
  mySql: {
    database: string;
    host: string;
    password: string;
    port: number;
    username: string;
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
  typeOrm: {
    dropSchema: boolean;
    logging: boolean;
    migrationsRun: boolean;
    synchronize: boolean;
  };
}
