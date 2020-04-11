import { join } from 'path';

import { toSecretConfig } from './mappers/config.mappers';
import { SecretConfig } from './models/models';
import { fileLoad } from './utils/utils';

export const EMAIL_SEND_DEFAULT_LIMIT = 2;
export const EMAIL_SEND_MAX_LIMIT = 4;

export const DISCOUNT_PERCENTAGE_MAX = 20;

export const ORDER_DELIVERY_PLUS_PAYMENT_SIZE = 2;
export const ORDER_PRODUCTS_SIZE_MIN = 1;
export const ORDER_PRODUCTS_SIZE_MAX = 100;

export const ORDER_PAYMENT_RETURN_URL = (base: string, uuid: string) => `${base}/#order/${uuid}`;

export const getSecretConfig = (): SecretConfig => {
  try {
    return toSecretConfig(fileLoad(join(__dirname, '/secret-config.json')));
  } catch (error) {
    throw `Cannot get secret config due to: [${error}]`;
  }
};
