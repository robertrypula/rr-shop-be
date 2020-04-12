import { removeMultipleWhitespaceCharacters } from './transformation.utils';

export const getCashRegisterName = (name: string, cutIfTooLong = true): string => {
  // From 'Elzab K10 Online' cash register documentation:
  //   * range: 1 - 40 chars
  //   * available chars: space ABCDEFGHIJKLMNOPQRSTUVWXYZ ĄĆĘŁŃÓŚŹŻ 0123456789 % / \ . ,
  // https://pl.wikipedia.org/wiki/CP852#Rozmieszczenie_polskich_znak%C3%B3w
  let result: string = `${name}`.toUpperCase().replace(/[^ A-ZĄĆĘŁŃÓŚŹŻ0-9%/\\.,]/g, '');

  result = removeMultipleWhitespaceCharacters(result).trim();

  return cutIfTooLong ? result.substr(0, 40) : result;
};

export const getSlugFromPolishString = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/%/g, '-procent')
    .replace(/_/g, '-')
    .replace(/,/g, '-')
    .replace(/\./g, '-')
    .replace(/ą/g, 'a')
    .replace(/ć/g, 'c')
    .replace(/ę/g, 'e')
    .replace(/ł/g, 'l')
    .replace(/ń/g, 'n')
    .replace(/ó/g, 'o')
    .replace(/ś/g, 's')
    .replace(/ź/g, 'z')
    .replace(/ż/g, 'z')
    .replace(/\s\s+/g, ' ')
    .trim()
    .replace(/\s/g, '-')
    .replace(/--+/g, '-')
    .replace(/[^\-a-z0-9]/gi, '');
};
