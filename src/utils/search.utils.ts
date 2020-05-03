import { compareTwoStrings } from 'string-similarity';

import {
  PRODUCT_SEARCH_FULL_PHRASE_MAX_RATING_FRACTION,
  PRODUCT_SEARCH_FULL_PHRASE_RATING_THRESHOLD,
  PRODUCT_SEARCH_ON2_PERFORMANCE_LIMIT,
  PRODUCT_SEARCH_WORD_MIN_CHARACTER,
  PRODUCT_SEARCH_WORD_RATING_THRESHOLD
} from '../config';
import { ProductQueryResult } from '../models/product.models';
import { removeMultipleWhitespaceCharacters } from './transformation.utils';

// TODO check it - probably Levenshtein is better in matching words:
// https://jacoby.github.io/2019/01/08/levenshtein-sorensendice-and-practical-information-theory.html

export const getRatingByWords = (stringA: string, stringB: string): number => {
  const wordsA: string[] = getWords(stringA.toLowerCase());
  const wordsB: string[] = getWords(stringB.toLowerCase());
  let breakFlag = false;
  let counter = 0;
  let foundWords = 0;
  let wordRating: number;
  let wordsRating = 0;

  for (let i = 0; i < wordsA.length; i++) {
    for (let j = 0; j < wordsB.length; j++) {
      breakFlag = ++counter > PRODUCT_SEARCH_ON2_PERFORMANCE_LIMIT;
      if (breakFlag) {
        break;
      }
      wordRating = compareTwoStrings(wordsA[i], wordsB[j]);
      if (wordRating >= PRODUCT_SEARCH_WORD_RATING_THRESHOLD) {
        foundWords++;
        wordsRating += wordRating;
      }
    }
    if (breakFlag) {
      break;
    }
  }

  return 1000000 * foundWords + 10 * Math.round(1000 * wordsRating);
};

export const getRatingByFullPhrase = (stringA: string, stringB: string): number => {
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
    .filter((word: string): boolean => word.length >= PRODUCT_SEARCH_WORD_MIN_CHARACTER);
};

const sortByRating = (a: ProductQueryResult, b: ProductQueryResult): number =>
  a.rating === b.rating ? 0 : a.rating < b.rating ? 1 : -1;

export const getProcessedProductQueryResults = (
  productQueryResults: ProductQueryResult[],
  query: string
): ProductQueryResult[] => {
  let ratingByFullPhraseMax = 0;

  if (!productQueryResults || productQueryResults.length === 0) {
    return [];
  }

  for (let i = 0; i < productQueryResults.length; i++) {
    const productQueryResult: ProductQueryResult = productQueryResults[i];
    const stringToSearchIn = `${productQueryResult.name} ${productQueryResult.manufacturerName}`;
    const ratingByWords: number = getRatingByWords(query, stringToSearchIn);
    const ratingByFullPhrase: number = getRatingByFullPhrase(query, stringToSearchIn);

    ratingByFullPhraseMax = ratingByFullPhrase > ratingByFullPhraseMax ? ratingByFullPhrase : ratingByFullPhraseMax;
    productQueryResults[i].rating = ratingByWords + ratingByFullPhrase;
  }

  productQueryResults.sort(sortByRating);

  return productQueryResults.filter(
    (productQueryResult: ProductQueryResult): boolean =>
      productQueryResult.rating >= PRODUCT_SEARCH_FULL_PHRASE_RATING_THRESHOLD &&
      productQueryResult.rating >= ratingByFullPhraseMax * PRODUCT_SEARCH_FULL_PHRASE_MAX_RATING_FRACTION
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
