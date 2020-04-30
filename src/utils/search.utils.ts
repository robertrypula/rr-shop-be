import { compareTwoStrings } from 'string-similarity';

import { ProductQueryResult } from '../models/product.models';
import { removeMultipleWhitespaceCharacters } from './transformation.utils';

export const getWords = (value: string): string[] => {
  return removeMultipleWhitespaceCharacters(value)
    .trim()
    .split(' ')
    .filter((word: string): boolean => word.length > 2);
};

export const getProcessedProductQueryResults = (
  productQueryResults: ProductQueryResult[],
  query: string,
  ratingThreshold: number
): ProductQueryResult[] => {
  for (let i = 0; i < productQueryResults.length; i++) {
    const item = productQueryResults[i];

    productQueryResults[i].rating = compareTwoStrings(`${item.name} ${item.manufacturerName}`, query);
  }

  productQueryResults.sort((a: ProductQueryResult, b: ProductQueryResult): number =>
    a.rating === b.rating ? 0 : a.rating < b.rating ? 1 : -1
  );

  return productQueryResults;
};

export const getStringsFromProductQueryResults = (
  productQueryResults: ProductQueryResult[],
  limit: number
): string[] => {
  return productQueryResults
    .map(i => `${i.rating.toFixed(6)} | ${(i.id + '').padStart(4, '0')} | ${i.name} | ${i.manufacturerName}`)
    .slice(0, limit);
};
