import { compareTwoStrings } from 'string-similarity';

import { ProductQueryResult } from '../models/product.models';
import { removeMultipleWhitespaceCharacters } from './transformation.utils';

const getRatingByWords = (stringA: string, stringB: string, log = false): number => {
  const wordsA: string[] = getWords(stringA.toLowerCase());
  const wordsB: string[] = getWords(stringB.toLowerCase());
  let wordsRating = 0;
  let foundWords = 0;

  for (let i = 0; i < wordsA.length; i++) {
    for (let j = 0; j < wordsB.length; j++) {
      const wordRating: number = compareTwoStrings(wordsA[i], wordsB[j]);
      if (wordRating >= 0.7) {
        foundWords += 1;
        // true && console.log(wordRating > 0.7 ? '## ' : '   ', wordRating.toFixed(6), wordsA[i], wordsB[j]);
        wordsRating += wordRating;
      }
    }
  }

  return 1000000 * foundWords + 10 * Math.round(1000 * wordsRating);
};

const getRatingByFullPhrase = (stringA: string, stringB: string): number => {
  return compareTwoStrings(stringA, stringB);
};

export const getWords = (value: string): string[] => {
  return removeMultipleWhitespaceCharacters(
    value
      .replace(/-/g, ' ')
      .replace(/\(/g, ' ')
      .replace(/\)/g, ' ')
  )
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
  let ratingByFullPhraseMax = 0;

  if (!productQueryResults || productQueryResults.length === 0) {
    return [];
  }

  for (let i = 0; i < productQueryResults.length; i++) {
    const productQueryResult: ProductQueryResult = productQueryResults[i];
    const stringToSearchIn = `${productQueryResult.name} ${productQueryResult.manufacturerName}`;
    const ratingByWords = getRatingByWords(query, stringToSearchIn);
    const ratingByFullPhrase = getRatingByFullPhrase(query, stringToSearchIn);

    ratingByFullPhraseMax = ratingByFullPhrase > ratingByFullPhraseMax ? ratingByFullPhrase : ratingByFullPhraseMax;
    productQueryResults[i].rating = ratingByWords + ratingByFullPhrase;
  }

  productQueryResults.sort(sortByRating);

  return productQueryResults.filter(
    (productQueryResult: ProductQueryResult): boolean =>
      productQueryResult.rating >= 0.5 && productQueryResult.rating >= ratingByFullPhraseMax * 0.8
  );
};

export const getStringsFromProductQueryResults = (
  productQueryResults: ProductQueryResult[],
  limit: number
): string[] => {
  return productQueryResults
    .map((productQueryResult: ProductQueryResult): string =>
      [
        `${productQueryResult.rating.toFixed(6).padStart(8 + 1 + 6, ' ')} `,
        `| ${(productQueryResult.id + '').padStart(4, '0')} `,
        `| ${productQueryResult.name} | ${productQueryResult.manufacturerName}`
      ].join('')
    )
    .slice(0, limit);
};
