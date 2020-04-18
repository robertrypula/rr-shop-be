import { SecretConfig } from '../models/models';
import { Environment } from '../simple-pay-u/models';

export const toSecretConfig = (fileContent: string): SecretConfig => {
  const o: any = JSON.parse(fileContent);

  if (!o.admin || !o.application || !o.gmail || !o.jwt || !o.mySql || !o.payU || !o.typeOrm) {
    throw `Missing 'admin', 'application', 'gmail', 'jwt', 'mySql', 'payU' or 'typeOrm' fields`;
  }

  if (!o.admin.username || !o.admin.password) {
    throw `Missing field(s) inside 'admin' field`;
  }

  if (!o.application.baseUrl) {
    throw `Missing field(s) inside 'application' field`;
  }

  if (
    !o.gmail.clientId ||
    !o.gmail.clientSecret ||
    !o.gmail.from ||
    !o.gmail.refreshToken ||
    !o.gmail.subjectPrefix ||
    !o.gmail.user
  ) {
    throw `Missing field(s) inside 'gmail' field`;
  }

  if (!o.mySql.database || !o.mySql.host || !o.mySql.password || !o.mySql.port || !o.mySql.username) {
    throw `Missing field(s) inside 'mySql' field`;
  }

  if (!o.jwt.expiresIn || !o.jwt.secret) {
    throw `Missing field(s) inside 'jwt' field`;
  }

  if (
    !o.payU.clientId ||
    !o.payU.clientSecret ||
    !o.payU.continueUrl ||
    !o.payU.currencyCode ||
    !o.payU.merchantPosId ||
    !o.payU.notifyUrl ||
    !o.payU.secondKey
  ) {
    throw `Missing field(s) inside 'payU' field`;
  }

  if (
    !o.payU.environment ||
    !(o.payU.environment === Environment.Sandbox || o.payU.environment === Environment.Production)
  ) {
    throw `Missing or wrong 'payU.environment' field`;
  }

  if (
    typeof o.typeOrm.dropSchema !== 'boolean' ||
    typeof o.typeOrm.logging !== 'boolean' ||
    typeof o.typeOrm.migrationsRun !== 'boolean' ||
    typeof o.typeOrm.synchronize !== 'boolean'
  ) {
    throw `Missing field(s) inside 'typeOrm' field`;
  }

  return {
    admin: {
      password: o.admin.password,
      username: o.admin.username
    },
    application: {
      baseUrl: o.application.baseUrl
    },
    gmail: {
      clientId: o.gmail.clientId,
      clientSecret: o.gmail.clientSecret,
      from: o.gmail.from,
      refreshToken: o.gmail.refreshToken,
      subjectPrefix: o.gmail.subjectPrefix,
      user: o.gmail.user
    },
    jwt: {
      expiresIn: o.jwt.expiresIn,
      secret: o.jwt.secret
    },
    mySql: {
      database: o.mySql.database,
      host: o.mySql.host,
      password: o.mySql.password,
      port: o.mySql.port,
      username: o.mySql.username
    },
    payU: {
      clientId: o.payU.clientId,
      clientSecret: o.payU.clientSecret,
      continueUrl: o.payU.continueUrl,
      currencyCode: o.payU.currencyCode,
      environment: o.payU.environment,
      merchantPosId: o.payU.merchantPosId,
      notifyUrl: o.payU.notifyUrl,
      secondKey: o.payU.secondKey
    },
    typeOrm: {
      dropSchema: o.typeOrm.dropSchema,
      logging: o.typeOrm.logging,
      migrationsRun: o.typeOrm.migrationsRun,
      synchronize: o.typeOrm.synchronize
    }
  };
};
