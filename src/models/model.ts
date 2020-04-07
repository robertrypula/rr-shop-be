import { Environment } from '../simple-pay-u/models';

export interface JwtPayload {
  userId: number;
  username: string;
  iat?: number;
  exp?: number;
}

export interface SecretConfig {
  admin: {
    password: string;
    username: string;
  };
  gmail: {
    clientId: string;
    clientSecret: string;
    from: string;
    refreshToken: string;
    subjectPrefix: string;
    user: string;
  };
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

export interface TestCase<T, U> {
  input: T;
  output: U;
}
