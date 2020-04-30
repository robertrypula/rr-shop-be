import { compareTwoStrings } from 'string-similarity';

import { ProductQueryResult } from '../models/product.models';
import { removeMultipleWhitespaceCharacters } from './transformation.utils';

export const getWords = (value: string): string[] => {
  return removeMultipleWhitespaceCharacters(value)
    .trim()
    .split(' ')
    .filter((word: string): boolean => word.length > 2);
};

const sortByRating = (a: ProductQueryResult, b: ProductQueryResult): number =>
  a.rating === b.rating ? 0 : a.rating < b.rating ? 1 : -1;

export const getProcessedProductQueryResults = (
  productQueryResults: ProductQueryResult[],
  query: string,
  ratingThreshold: number
): ProductQueryResult[] => {
  let maxRating: number;

  if (!productQueryResults || productQueryResults.length === 0) {
    return [];
  }

  for (let i = 0; i < productQueryResults.length; i++) {
    const productQueryResult: ProductQueryResult = productQueryResults[i];
    const stringToSearchIn = `${productQueryResult.name} ${productQueryResult.manufacturerName}`;

    productQueryResults[i].rating = compareTwoStrings(stringToSearchIn, query);
  }

  productQueryResults.sort(sortByRating);

  maxRating = productQueryResults[0].rating;
  for (let i = 0; i < productQueryResults.length; i++) {
    productQueryResults[i].rating /= maxRating;
  }

  return productQueryResults.filter(
    (productQueryResult: ProductQueryResult): boolean => productQueryResult.rating >= ratingThreshold
  );
};

export const getStringsFromProductQueryResults = (
  productQueryResults: ProductQueryResult[],
  limit: number
): string[] => {
  return productQueryResults
    .map(i => `${i.rating.toFixed(6)} | ${(i.id + '').padStart(4, '0')} | ${i.name} | ${i.manufacturerName}`)
    .slice(0, limit);
};
