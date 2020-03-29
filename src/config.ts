import { join } from 'path';

import { toSecretConfig } from './mappers/config.mappers';
import { SecretConfig } from './models/model';
import { fileLoad } from './utils/utils';

export const getSecretConfig = (): SecretConfig => {
  try {
    return toSecretConfig(fileLoad(join(__dirname, '/secret-config.json')));
  } catch (error) {
    throw `Cannot get secret config due to: [${error}]`;
  }
};
