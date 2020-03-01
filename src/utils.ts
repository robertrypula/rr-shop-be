import { readFileSync, writeFileSync } from 'fs';

export const fileLoad = (fullPath: string): any => {
  return readFileSync(fullPath, 'utf8');
};

export const fileSave = (fullPath: string, content: string): void => {
  writeFileSync(fullPath, content, 'utf8');
};
