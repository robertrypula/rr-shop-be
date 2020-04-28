import { readFileSync, writeFileSync } from 'fs';

export const fileLoad = (fullPath: string): any => {
  return readFileSync(fullPath, 'utf8');
};

export const fileSave = (fullPath: string, content: string): void => {
  writeFileSync(fullPath, content, 'utf8');
};

export const reStringifyPretty = (json: string): string => {
  try {
    return JSON.stringify(JSON.parse(json), null, 2);
  } catch (e) {
    return '';
  }
};

export const getDuplicates = <T>(array: T[]): T[] => {
  const map: { [key: string]: T } = {};
  const duplicates: T[] = [];

  array.forEach((item: T): void => {
    if (typeof map[`${item}`] !== 'undefined') {
      duplicates.push(item);
    } else {
      map[`${item}`] = null;
    }
  });

  return duplicates;
};

export const getUniqueValues = <T>(array: T[]): string[] => {
  const map: { [key: string]: T } = {};

  array.forEach((item: T): void => {
    if (typeof map[`${item}`] === 'undefined') {
      map[`${item}`] = null;
    }
  });

  return Object.keys(map);
};

export const getIdRangeName = (id: number, range: number, maxLength: number): string => {
  const start: number = Math.floor((id - 1) / range);

  return `${start * range + 1}`.padStart(maxLength, '0') + '-' + `${(start + 1) * range}`.padStart(maxLength, '0');
};

export const getRandomInt = (min: number, max: number): number => {
  // https://stackoverflow.com/a/1527820
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const stringifyPretty = (object: any): string => {
  return JSON.stringify(object, null, 2);
};
