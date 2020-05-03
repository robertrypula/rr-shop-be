import { ProductQueryResult, ProductsRatingMap } from '../models/product.models';

export const getProductsRatingMapFromRawRowsByCategoryIds = (rawRowsByCategoryIds: any[]): ProductsRatingMap => {
  const t = rawRowsByCategoryIds.reduce(
    (accumulator: ProductsRatingMap, rawRowByCategoryIds: any): ProductsRatingMap => {
      accumulator[`${rawRowByCategoryIds.id}`] = 0;

      return accumulator;
    },
    {}
  );

  return t;
};

export const getProductQueryResultsFromRawRowsByQuery = (rawRowsByQuery: any[]): ProductQueryResult[] => {
  return rawRowsByQuery.map(
    (rawRowByQuery: any): ProductQueryResult => ({
      id: rawRowByQuery.id,
      manufacturerName: rawRowByQuery.manufacturerName,
      name: rawRowByQuery.name
    })
  );
};

export const getProductsRatingMapFromProductIds = (productIds: number[]): ProductsRatingMap => {
  return productIds.reduce((accumulator: ProductsRatingMap, productId: number): ProductsRatingMap => {
    accumulator[`${productId}`] = 0;

    return accumulator;
  }, {});
};

export const getProductIdsFromProductsRatingMap = (ratedProductIds: ProductsRatingMap): number[] => {
  return Object.keys(ratedProductIds).map((productId: string): number => +productId);
};

export const getProductsRatingMapFromProductQueryResults = (
  productQueryResults: ProductQueryResult[]
): ProductsRatingMap => {
  return productQueryResults.reduce(
    (accumulator: ProductsRatingMap, productQueryResult: ProductQueryResult): ProductsRatingMap => {
      accumulator[`${productQueryResult.id}`] = productQueryResult.rating;

      return accumulator;
    },
    {}
  );
};
