import { join } from 'path';

import { toSecretConfig } from './mappers/config.mappers';
import { SecretConfig } from './models/models';
import { fileLoad } from './utils/utils';

export const EMAIL_SEND_DEFAULT_LIMIT = 2;
export const EMAIL_SEND_MAX_LIMIT = 4;

export const getSecretConfig = (): SecretConfig => {
  try {
    return toSecretConfig(fileLoad(join(__dirname, '/secret-config.json')));
  } catch (error) {
    throw `Cannot get secret config due to: [${error}]`;
  }
};
