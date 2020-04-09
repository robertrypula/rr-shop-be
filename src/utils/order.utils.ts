import { getRandomInt } from './utils';

export const getOrderNumber = (): string => {
  return `W-${getRandomInt(100, 999)}-${getRandomInt(100, 999)}-${getRandomInt(100, 999)}`;
};
