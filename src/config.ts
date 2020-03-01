import { join } from 'path';

import { toSecretConfig } from './mappers';
import { JwtConfig, PayUConfig, SecretConfig } from './model';
import { fileLoad } from './utils';

export const jwtConfig: JwtConfig = {
  expiresIn: '5m'
};

export const payUConfig: PayUConfig = {
  continueUrl: 'http://waleriana.pl', // in case of error: ?error=501
  currencyCode: 'PLN',
  notifyUrl: 'https://api.waleriana.pl/pay-u/notify'
};

export const getSecretConfig = (): SecretConfig => {
  try {
    return toSecretConfig(fileLoad(join(__dirname, '/secret-config.json')));
  } catch (error) {
    throw `Cannot get secret config due to: [${error}]`;
  }
};
