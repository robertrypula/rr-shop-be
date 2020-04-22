import { getRandomInt } from './utils';

const allowedCharacters = '23479WERTPAFLXNM';

const getRandomCharacter = () => {
  const length: number = allowedCharacters.length;
  let randomIndex: number = getRandomInt(0, length - 1);

  randomIndex = randomIndex < 0 ? 0 : randomIndex;
  randomIndex = randomIndex >= length ? length - 1 : randomIndex;

  return allowedCharacters.charAt(randomIndex);
};

export const getOrderNumber = (): string => {
  return [
    getRandomCharacter(),
    getRandomCharacter(),
    getRandomCharacter(),
    getRandomCharacter(),
    '-',
    getRandomCharacter(),
    getRandomCharacter(),
    getRandomCharacter(),
    getRandomCharacter()
  ].join('');
};
