import { getRandomInt } from './utils';

export const getOrderNumber = (): string => {
  return `WA-${getRandomInt(100, 999)}-${getRandomInt(100, 999)}`;
};
