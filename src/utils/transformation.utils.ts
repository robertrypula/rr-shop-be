import { ValidationError } from 'class-validator';

export const extractConstraints = (validationErrors: ValidationError[], errors: string[]): void => {
  validationErrors.forEach((validationError: ValidationError): void => {
    validationError.constraints &&
      Object.values(validationError.constraints).forEach((constraint: string): number => errors.push(constraint));
    validationError.children && extractConstraints(validationError.children, errors);
  });
};

export const extractBestBefore = (expectedQuantity: number, bestBefore: string): Date[] => {
  const result: Date[] = [];
  let date: Date;

  bestBefore = removeWhitespaceCharacters(bestBefore);

  if (bestBefore.indexOf('brak') === 0 || bestBefore.indexOf('nie') === 0) {
    date = null;
  } else if (bestBefore.length === 10) {
    date = parseDate(bestBefore);
  }

  if (typeof date !== 'undefined') {
    for (let i = 0; i < expectedQuantity; i++) {
      result.push(date);
    }
  } else if (bestBefore.indexOf(';') !== -1) {
    bestBefore.split(';').forEach((part: string): void => {
      const [partQuantity, partDate] = part.split('x');
      const dates: Date[] = extractBestBefore(+partQuantity, partDate);

      dates.forEach((d: Date): void => {
        result.push(d);
      });
    });
  }

  return result;
};

export const getFormattedDate = (
  date: Date,
  dateSeparator = '.',
  dateTimeSeparator = '_',
  timeSeparator = '.',
  millisecondsSeparator = '.'
): string => {
  const year: string = date.getFullYear() + '';
  const month: string = ('00' + (date.getMonth() + 1)).slice(-2);
  const day: string = ('00' + date.getDate()).slice(-2);
  const hour: string = ('00' + date.getHours()).slice(-2);
  const minute: string = ('00' + date.getMinutes()).slice(-2);
  const second: string = ('00' + date.getSeconds()).slice(-2);
  const milliseconds: string = ('000' + date.getMilliseconds()).slice(-3);

  return [
    `${year}${dateSeparator}${month}${dateSeparator}${day}`,
    `${dateTimeSeparator}`,
    `${hour}${timeSeparator}${minute}${timeSeparator}${second}${millisecondsSeparator}${milliseconds}`
  ].join('');
};

export const getFormattedPrice = (price: number): string => {
  return (price ? price : 0).toFixed(2);
};

export const getMap = <T extends { id: number }>(entities: T[]): { [key: string]: T } => {
  const initial: { [key: string]: T } = {};

  return entities.reduce((accumulator: { [id: string]: T }, entity: T) => {
    accumulator[`${entity.id}`] = entity;

    return accumulator;
  }, initial);
};

export const getNormalizedNamesTillTheEnd = (rowData: string[], startIndex: number, lengthThreshold = 2): string[] => {
  const result: string[] = [];

  for (let i = startIndex; i < rowData.length; i++) {
    const value: string = removeMultipleWhitespaceCharacters(rowData[i]).trim();

    if (value.length < lengthThreshold) {
      break;
    }
    result.push(value);
  }

  return result;
};

export const getNormalizedPrice = (price: number): number => {
  return Math.round(price * 100) / 100;
};

export const parseDate = (value: string): Date => {
  if (value.length !== 10) {
    throw new Error('Wrong date');
  }
  // 0123456789
  // 2020-11-27

  return new Date(
    parseInt(value.substr(0, 4), 10),
    parseInt(value.substr(5, 2), 10) - 1,
    parseInt(value.substr(8, 2), 10),
    12,
    0,
    0,
    0
  );
};

export const parsePrice = (value: string): number => {
  return parseFloat(`${value}`.replace(/,/g, '.'));
};

export const removeDuplicates = (array: string[]): string[] => {
  const map: { [key: string]: string } = {};

  array.forEach((item: string): void => {
    map[item] = '';
  });

  return Object.keys(map);
};

export const removeMultipleWhitespaceCharacters = (value: string): string => {
  return `${value}`.replace(/\s\s+/g, ' ');
};

export const removeWhitespaceCharacters = (value: string): string => {
  return `${value}`.replace(/\s/g, '');
};
