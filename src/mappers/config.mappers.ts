import { SecretConfig } from '../models/model';
import { Environment } from '../pay-u/models';

export const toSecretConfig = (fileContent: string): SecretConfig => {
  const o: any = JSON.parse(fileContent);

  if (!o.jwt || !o.payU) {
    throw `Missing 'jwt' or 'payU' fields`;
  }

  if (!o.jwt.expiresIn || !o.jwt.secret) {
    throw `Missing field(s) inside 'jwt' field`;
  }

  if (!o.payU.clientId || !o.payU.clientSecret || !o.payU.merchantPosId || !o.payU.secondKey) {
    throw `Missing field(s) inside 'payU' field`;
  }

  if (
    !o.payU.environment ||
    !(o.payU.environment === Environment.Sandbox || o.payU.environment === Environment.Production)
  ) {
    throw `Missing or wrong 'payU.environment' field`;
  }

  return {
    jwt: {
      expiresIn: o.jwt.expiresIn,
      secret: o.jwt.secret
    },
    payU: {
      clientId: o.payU.clientId,
      clientSecret: o.payU.clientSecret,
      environment: o.payU.environment,
      merchantPosId: o.payU.merchantPosId,
      secondKey: o.payU.secondKey
    }
  };
};
