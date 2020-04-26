import { join } from 'path';

import { getFormattedDate } from '../utils/transformation.utils';
import { fileSave, getRandomInt } from '../utils/utils';

export const fileLogger = (content: string, filenamePrefix = ''): void => {
  const filenamePrefixFormatted: string = filenamePrefix !== '' ? filenamePrefix + '_' : '';
  const filename = `${filenamePrefixFormatted}${getFormattedDate(new Date())}_${getRandomInt(10000, 99999)}.txt`;

  fileSave(join(__dirname, filename), content);
};
