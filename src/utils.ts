import { readFileSync, writeFileSync } from 'fs';

export const fileLoad = (fullPath: string): any => {
  return readFileSync(fullPath, 'utf8');
};

export const fileSave = (fullPath: string, content: string): void => {
  writeFileSync(fullPath, content, 'utf8');
};

export const getFormattedDate = (date: Date): string => {
  const year: string = date.getFullYear() + '';
  const month: string = ('00' + (date.getMonth() + 1)).slice(-2);
  const day: string = ('00' + date.getDate()).slice(-2);
  const hour: string = ('00' + date.getHours()).slice(-2);
  const minute: string = ('00' + date.getMinutes()).slice(-2);
  const second: string = ('00' + date.getSeconds()).slice(-2);
  const milliseconds: string = ('000' + date.getMilliseconds()).slice(-3);

  return `${year}.${month}.${day}_${hour}.${minute}.${second}.${milliseconds}`;
};

export const reStringifyPretty = (json: string): string => {
  try {
    return JSON.stringify(JSON.parse(json), null, 2);
  } catch (e) {
    return '';
  }
};

export const getRandomInt = (min: number, max: number): number => {
  // https://stackoverflow.com/a/1527820
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};
