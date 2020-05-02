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
        ''
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
          total: 81,
          firstFewResults: [
            '1.000000 | 0172 | Ekologiczny sok z kiszonych buraków 3l | Dary Natury',
            '0.932203 | 0161 | Ekologiczny sok z kiszonej kapusty 3l | Dary Natury',
            '0.784314 | 0171 | Ekologiczny sok z buraków 3l | Dary Natury',
            '0.750000 | 0209 | Ekologiczny sok z kiszonych ogórków 3l | Dary Natury',
            '0.566038 | 0201 | Ekologiczny sok z brzozy 270 ml | Dary Natury',
            '0.555556 | 0235 | Pneumovit zatoki spray do nosa 50ml | Gorvita',
            '0.542169 | 0311 | Dzikie oregano 100% naturalny olej, 90% Naturalnego karwakrolu 30 ml | Avitale',
            '0.512821 | 0013 | Kora kasztanowca 50g | Flos',
            '0.500000 | 0322 | Naturalny olejek z drzewa herbacianego 9ml | Dr Beta',
            '0.490196 | 0254 | Nasiona kozieradki 50g | Herbapol Kraków'
          ]
        }
      },
      {
        input: 'olej z oregano',
        output: {
          total: 90,
          firstFewResults: [
            '1.000000 | 0307 | Dzikie oregano, olej 100%, 90 kapsułek miękkich | Aliness',
            '0.820202 | 0077 | Mydełko antybakteryjne z oregano 80g | MarokoProdukt',
            '0.763158 | 0311 | Dzikie oregano 100% naturalny olej, 90% Naturalnego karwakrolu 30 ml | Avitale',
            '0.740741 | 0082 | Naturalne mydło z olejem z drzewa herbacianego i oregano 100g | Mydlarnia „Powrót do Natury”',
            '0.628726 | 0332 | Naturalny olejek sosnowy 9ml | Dr Beta',
            '0.613757 | 0333 | Naturalny olejek ylangowy 9ml | Dr Beta',
            '0.607966 | 0322 | Naturalny olejek z drzewa herbacianego 9ml | Dr Beta',
            '0.604167 | 0013 | Kora kasztanowca 50g | Flos',
            '0.599483 | 0321 | Naturalny olejek cytrynowy 9ml | Dr Beta',
            '0.599483 | 0324 | Naturalny olejek geraniowy 9ml | Dr Beta'
          ]
        }
      },
      {
        input: 'dziurawiec',
        output: {
          total: 107,
          firstFewResults: [
            '1.000000 | 0118 | Ekologiczne ziele dziurawca 50g | Dary Natury',
            '0.906404 | 0151 | Jałowiec 30g | Dary Natury',
            '0.842491 | 0244 | Kwiat dziewanny 50g | Herbapol Kraków',
            '0.710425 | 0334 | Vapomix ch-4 dla dzieci 9ml | Dr Beta',
            '0.644258 | 0278 | Balsam jerozolimski dla dzieci 200ml | Boni Fratres',
            '0.635945 | 0202 | Ekologiczna herbatka dla dzieci krasnoludek 25x2g | Dary Natury',
            '0.635945 | 0231 | Naturalna woda lecznicza Jan 5l | Uzdrowisko Krynica-Żegiestów',
            '0.625850 | 0264 | Syrop z dziewanny 100ml | Herbapol Kraków',
            '0.619946 | 0174 | Ekologiczny olej dla dzieci junior 250ml | Dary Natury',
            '0.619946 | 0227 | Sok z żurawin wielkoowocowych bez cukru 250ml | Sam Sok'
          ]
        }
      }
    ];

    productQueryTestVectorItems.forEach((productQueryTestVectorItem: ProductQueryTestVectorItem): void => {
      it(`should return proper results for given query - ${productQueryTestVectorItem.input}`, (): void => {
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
