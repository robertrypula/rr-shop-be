import { ProductQueryResult, ProductQueryTestVectorItem } from '../models/product.models';
import {
  getProcessedProductQueryResults,
  getRatingByFullPhrase,
  getRatingByWords,
  getStringsFromProductQueryResults,
  getWords
} from './search.utils';
import { createProductQueryResults } from './search.utils.spec-data';

// tslint:disable:object-literal-sort-keys
// tslint:disable:max-line-length

describe('String similarity utils', (): void => {
  describe('getRatingByWords', (): void => {
    it('should find 2 perfectly matched words', (): void => {
      expect(
        getRatingByWords('oregano 90%', 'Dzikie oregano 100% naturalny olej, 90% Naturalnego karwakrolu 30 ml Avitale')
      ).toBeCloseTo(2020000, 6);
    });

    it('should find words even with typos', (): void => {
      expect(
        getRatingByWords(
          'dzikee oregan',
          'Dzikie oregano 100% naturalny olej, 90% Naturalnego karwakrolu 30 ml Avitale'
        )
      ).toBeCloseTo(1009090, 6);
    });
  });

  describe('getRatingByFullPhrase', (): void => {
    it('should find two words in long phrase', (): void => {
      expect(
        getRatingByFullPhrase(
          'oregano 90%',
          'Dzikie oregano 100% naturalny olej, 90% Naturalnego karwakrolu 30 ml Avitale'
        )
      ).toBeCloseTo(0.21621621621621623, 6);
    });

    it('should find single word with typos - one upper case one lower case', (): void => {
      expect(getRatingByFullPhrase('dzikee', 'Dzikie')).toBeCloseTo(0.4, 6);
    });

    it('should find single word with typos - all lower case', (): void => {
      expect(getRatingByFullPhrase('dzikee', 'dzikie')).toBeCloseTo(0.6, 6);
    });
  });

  describe('getWords', (): void => {
    it('should split words', (): void => {
      expect(getWords('czerwona papryka')).toEqual(['czerwona', 'papryka']);
    });

    it('should filter out short words', (): void => {
      expect(getWords('olejek do smarowania')).toEqual(['olejek', 'smarowania']);
    });

    it(`should split '-' characters`, (): void => {
      expect(getWords('żeń-szeń')).toEqual(['żeń', 'szeń']);
    });

    it(`should split longer phrase`, (): void => {
      expect(getWords('Maślan Sodu 550 mg (Kwas masłowy 170 mg), 100 VEGE kapsułek MedicaLine')).toEqual([
        'Maślan',
        'Sodu',
        '550',
        'Kwas',
        'masłowy',
        '170',
        '100',
        'VEGE',
        'kapsułek',
        'MedicaLine'
      ]);
    });
  });

  describe('getProcessedProductQueryResults', (): void => {
    const LIMIT = 10;

    const productQueryTestVectorItems: ProductQueryTestVectorItem[] = [
      {
        input: 'sok z buraka kiszonego', // 'bura' x 2 | 'kiszo' x 3 | 'sok' x 9
        output: {
          total: 14,
          firstFewResults: [
            ' 2020000.129032 | 0227 | Sok z żurawin wielkoowocowych bez cukru 250ml | Sam Sok',
            ' 2020000.129032 | 0228 | Sok z żurawin wielkoowocowych bez cukru 500ml | Sam Sok',
            ' 2020000.127660 | 0223 | Sok z granata bez cukru 250ml | Sam Sok',
            ' 2020000.088889 | 0224 | Sok z jagód bez cukru 250ml | Sam Sok',
            ' 2018000.372881 | 0161 | Ekologiczny sok z kiszonej kapusty 3l | Dary Natury',
            ' 2017270.400000 | 0172 | Ekologiczny sok z kiszonych buraków 3l | Dary Natury',
            ' 2017270.313725 | 0171 | Ekologiczny sok z buraków 3l | Dary Natury',
            ' 1010000.300000 | 0209 | Ekologiczny sok z kiszonych ogórków 3l | Dary Natury',
            ' 1010000.226415 | 0201 | Ekologiczny sok z brzozy 270 ml | Dary Natury',
            ' 1010000.160000 | 0170 | Ekologiczny sok z jabłek 3l | Dary Natury'
          ]
        }
      },
      {
        input: 'olej z oregano', // 'olej' x 23 | 'oreg' x 4
        output: {
          total: 28,
          firstFewResults: [
            ' 2019230.310345 | 0307 | Dzikie oregano, olej 100%, 90 kapsułek miękkich | Aliness',
            ' 2018570.236842 | 0311 | Dzikie oregano 100% naturalny olej, 90% Naturalnego karwakrolu 30 ml | Avitale',
            ' 2017500.229885 | 0082 | Naturalne mydło z olejem z drzewa herbacianego i oregano 100g | Mydlarnia „Powrót do Natury”',
            ' 1010000.254545 | 0077 | Mydełko antybakteryjne z oregano 80g | MarokoProdukt',
            ' 1010000.163934 | 0162 | Ekologiczny olej z nasion konopi siewnych 100ml | Dary Natury',
            ' 1010000.160000 | 0165 | Ekologiczny olej z wiesiołka 100ml | Dary Natury',
            ' 1010000.145455 | 0174 | Ekologiczny olej dla dzieci junior 250ml | Dary Natury',
            ' 1010000.130435 | 0173 | Ekologiczny olej dla mam 250ml | Dary Natury',
            ' 1010000.113208 | 0222 | Olej lniany BOFLAX® do diety dr Budwig 250ml | IWNiRZ',
            ' 1010000.113208 | 0318 | Olej lniany BOFLAX® do diety dr Budwig 500ml | IWNiRZ'
          ]
        }
      },
      {
        input: 'dziurawiec', // 'dziura' x 2
        output: {
          total: 2,
          firstFewResults: [
            ' 1007060.304348 | 0118 | Ekologiczne ziele dziurawca 50g | Dary Natury',
            ' 1007060.181818 | 0204 | Ekologiczne ziele dziurawca 25x2g - zioła do zaparzania w saszetkach | Dary Natury'
          ]
        }
      },
      {
        input: 'babka lancetowata', // 'lance' x 1
        output: {
          total: 1,
          firstFewResults: [' 2016070.406780 | 0121 | Ekologiczny liść babki lancetowatej 25g | Dary Natury']
        }
      },
      {
        input: 'jeżówka purpurowa', // 'purp' x 3
        output: {
          total: 3,
          firstFewResults: [
            ' 2020000.368421 | 0248 | Jeżówka purpurowa 20x2g - herbatka ziołowa w saszetkach | Herbapol Kraków',
            ' 2017080.338028 | 0185 | Ekologiczna zielona herbata z jeżówką purpurową 25x2g | Dary Natury',
            ' 2016570.558140 | 0011 | Ziele jeżówki purpurowej 50g | Flos'
          ]
        }
      },
      {
        input: 'anyż', // 'any' x 7 | 'anyż' x 2
        output: {
          total: 2,
          firstFewResults: [
            ' 1010000.200000 | 0131 | Ekologiczny anyż 30g | Dary Natury',
            ' 1008570.214286 | 0256 | Owoc anyżu 50g | Herbapol Kraków'
          ]
        }
      },
      {
        input: 'mus z rokitnika', // 'rok' x 2
        output: {
          total: 1,
          firstFewResults: [
            ' 4039330.252632 | 0068 | Złoto z rokitnika - niepasteryzowany mus z owoców rokitnika 500ml | Rokitnik i przyjaciele Sp. z o.o.'
          ]
        }
      },
      {
        input: 'sok z rokitnika', // 'rok' x 2
        output: {
          total: 15,
          firstFewResults: [
            ' 3029330.210526 | 0068 | Złoto z rokitnika - niepasteryzowany mus z owoców rokitnika 500ml | Rokitnik i przyjaciele Sp. z o.o.',
            ' 2020000.153846 | 0224 | Sok z jagód bez cukru 250ml | Sam Sok',
            ' 2020000.146341 | 0223 | Sok z granata bez cukru 250ml | Sam Sok',
            ' 2020000.107143 | 0227 | Sok z żurawin wielkoowocowych bez cukru 250ml | Sam Sok',
            ' 2020000.107143 | 0228 | Sok z żurawin wielkoowocowych bez cukru 500ml | Sam Sok',
            ' 1010000.241379 | 0230 | Owocowa witamina C - sok z dzikiej róży 250ml | Polska Róża',
            ' 1010000.188679 | 0161 | Ekologiczny sok z kiszonej kapusty 3l | Dary Natury',
            ' 1010000.166667 | 0226 | Ekologiczny sok z pokrzywy 500ml | PolBioEco',
            ' 1010000.148148 | 0172 | Ekologiczny sok z kiszonych buraków 3l | Dary Natury',
            ' 1010000.148148 | 0209 | Ekologiczny sok z kiszonych ogórków 3l | Dary Natury'
          ]
        }
      },
      {
        input: 'żeń szeń', // 'szeń' x 1
        output: {
          total: 1,
          firstFewResults: [' 2020000.142857 | 0237 | Napój panax ginseng extractum 10x10ml (Żeń-szeń) | Meridian']
        }
      },
      {
        input: 'zabłocka mgiełka solankowa', // 'sola' x 2
        output: {
          total: 2,
          firstFewResults: [
            ' 3030000.597015 | 0088 | Mgiełka solankowa jodowo-bromowa 950ml | Dr Zabłocka',
            ' 3027140.405405 | 0089 | Zabłocka solanka termalna jodowo-bromowa 950ml | Dr Zabłocka'
          ]
        }
      },
      {
        input: 'czerwona papryka', // 'papr' x 2
        output: {
          total: 4,
          firstFewResults: [
            ' 2020000.474576 | 0130 | Ekologiczna papryka czerwona mielona 50g | Dary Natury',
            ' 1010000.357143 | 0136 | Ekologiczna papryka ostra mielona 90g | Dary Natury',
            ' 1008570.400000 | 0147 | Pieprz czerwony 20g | Dary Natury',
            ' 1008000.279070 | 0017 | Kwiat czerwonej koniczyny 50g | Flos'
          ]
        }
      },
      {
        input: 'wojtek lubi', // Tags test
        output: {
          total: 1,
          firstFewResults: [
            ' 2020000.290323 | 0158 | wojtek lubi | Ekologiczny syrop z pączków sosny 270ml | Dary Natury'
          ]
        }
      }
    ];

    productQueryTestVectorItems.forEach((productQueryTestVectorItem: ProductQueryTestVectorItem): void => {
      it(`should return proper results for given query - ${productQueryTestVectorItem.input}`, (): void => {
        const processedProductQueryResults: ProductQueryResult[] = getProcessedProductQueryResults(
          createProductQueryResults(),
          productQueryTestVectorItem.input
        );

        expect({
          total: processedProductQueryResults.length,
          firstFewResults: getStringsFromProductQueryResults(processedProductQueryResults, LIMIT)
        }).toEqual(productQueryTestVectorItem.output);
      });
    });
  });
});
