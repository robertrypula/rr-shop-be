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

export const getDuplicates = (array: string[]): string[] => {
  const map: { [key: string]: string } = {};
  const duplicates: string[] = [];

  array.forEach((item: string): void => {
    if (typeof map[item] !== 'undefined') {
      duplicates.push(item);
    } else {
      map[item] = '';
    }
  });

  return duplicates;
};

export const getIdRangeName = (id: number, range): string => {
  return ''; // TODO implement
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
