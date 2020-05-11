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

export const PRODUCT_SEARCH_FULL_PHRASE_MAX_RATING_FRACTION = 0.8;
export const PRODUCT_SEARCH_FULL_PHRASE_RATING_THRESHOLD = 0.5;
export const PRODUCT_SEARCH_ON2_PERFORMANCE_LIMIT = 64;
export const PRODUCT_SEARCH_WORD_MIN_CHARACTER = 3;
export const PRODUCT_SEARCH_WORD_RATING_THRESHOLD = 0.7;

export const ORDER_PAGE_URL = (applicationBaseUrl: string, uuid: string) => `${applicationBaseUrl}/#order/${uuid}`;

export const getSecretConfig = (): SecretConfig => {
  try {
    return toSecretConfig(fileLoad(join(__dirname, '/secret-config.json')));
  } catch (error) {
    throw `Cannot get secret config due to: [${error}]`;
  }
};
