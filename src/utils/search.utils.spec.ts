import { ProductQueryResult, ProductQueryTestVectorItem } from '../models/product.models';
import { getProcessedProductQueryResults, getStringsFromProductQueryResults, getWords } from './search.utils';
import { createProductQueryResults } from './search.utils.spec-data';

// tslint:disable:object-literal-sort-keys
// tslint:disable:max-line-length

describe('String similarity utils', (): void => {
  describe('getWords', (): void => {
    it('should split words', (): void => {
      expect(getWords('czerwona papryka')).toEqual(['czerwona', 'papryka']);
    });

    it('should filter out short words', (): void => {
      expect(getWords('olejek do smarowania')).toEqual(['olejek', 'smarowania']);
    });
  });

  describe('getProcessedProductQueryResults', (): void => {
    const LIMIT = 10;
    const RATING_THRESHOLD = 0.3;
    /*
      Issues:
        'dziurawiec'
        'babka lancetowata'
        'jeżówka purpurowa' powinno być 3 a nie jeden
        'anyż' - dziwne wyniki
        'mus z rokitnika'
        'sok z rokitnika'
        'żeń szeń'  tylko z myślnikiem
        'zabłocka mgiełka solankowa'
        'czerwona papryka'
     */

    const productQueryTestVectorItems: ProductQueryTestVectorItem[] = [
      {
        input: 'sok z buraka kiszonego',
        output: {
          total: 1,
          firstFewResults: [
            '0.400000 | 0172 | Ekologiczny sok z kiszonych buraków 3l | Dary Natury',
            '0.372881 | 0161 | Ekologiczny sok z kiszonej kapusty 3l | Dary Natury',
            '0.313725 | 0171 | Ekologiczny sok z buraków 3l | Dary Natury',
            '0.300000 | 0209 | Ekologiczny sok z kiszonych ogórków 3l | Dary Natury',
            '0.226415 | 0201 | Ekologiczny sok z brzozy 270 ml | Dary Natury',
            '0.222222 | 0235 | Pneumovit zatoki spray do nosa 50ml | Gorvita',
            '0.216867 | 0311 | Dzikie oregano 100% naturalny olej, 90% Naturalnego karwakrolu 30 ml | Avitale',
            '0.205128 | 0013 | Kora kasztanowca 50g | Flos',
            '0.200000 | 0322 | Naturalny olejek z drzewa herbacianego 9ml | Dr Beta',
            '0.196078 | 0254 | Nasiona kozieradki 50g | Herbapol Kraków'
          ]
        }
      },
      {
        input: 'olej z oregano',
        output: {
          total: 1,
          firstFewResults: [
            '0.310345 | 0307 | Dzikie oregano, olej 100%, 90 kapsułek miękkich | Aliness',
            '0.254545 | 0077 | Mydełko antybakteryjne z oregano 80g | MarokoProdukt',
            '0.236842 | 0311 | Dzikie oregano 100% naturalny olej, 90% Naturalnego karwakrolu 30 ml | Avitale',
            '0.229885 | 0082 | Naturalne mydło z olejem z drzewa herbacianego i oregano 100g | Mydlarnia „Powrót do Natury”',
            '0.195122 | 0332 | Naturalny olejek sosnowy 9ml | Dr Beta',
            '0.190476 | 0333 | Naturalny olejek ylangowy 9ml | Dr Beta',
            '0.188679 | 0322 | Naturalny olejek z drzewa herbacianego 9ml | Dr Beta',
            '0.187500 | 0013 | Kora kasztanowca 50g | Flos',
            '0.186047 | 0321 | Naturalny olejek cytrynowy 9ml | Dr Beta',
            '0.186047 | 0324 | Naturalny olejek geraniowy 9ml | Dr Beta'
          ]
        }
      }
    ];

    it('should return proper results for given query', (): void => {
      productQueryTestVectorItems.forEach((productQueryTestVectorItem: ProductQueryTestVectorItem): void => {
        const processedProductQueryResults: ProductQueryResult[] = getProcessedProductQueryResults(
          createProductQueryResults(),
          productQueryTestVectorItem.input,
          RATING_THRESHOLD
        );

        expect({
          total: processedProductQueryResults.length,
          firstFewResults: getStringsFromProductQueryResults(processedProductQueryResults, LIMIT)
        }).toEqual(productQueryTestVectorItem.output);
      });
    });
  });
});
