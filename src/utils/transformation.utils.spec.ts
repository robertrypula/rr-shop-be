import { extractBestBefore, getFormattedDate } from './transformation.utils';

describe('Transformation utils', (): void => {
  describe('extractBestBefore', (): void => {
    const map = (d: Date): string => (d !== null ? getFormattedDate(d, '-', ' ', ':', '.') : null);

    it('should work with single date', (): void => {
      expect(extractBestBefore(3, '2020-08-21').map(map)).toEqual([
        '2020-08-21 12:00:00.000',
        '2020-08-21 12:00:00.000',
        '2020-08-21 12:00:00.000'
      ]);
    });

    it('should work with single date', (): void => {
      expect(extractBestBefore(3, 'brak').map(map)).toEqual([null, null, null]);
    });

    it('should work with multiple dates with quantities - 1 x date; 1 x date', (): void => {
      expect(extractBestBefore(3, '1 x 2020-08-31; 1 x 2020-09-30').map(map)).toEqual([
        '2020-08-31 12:00:00.000',
        '2020-09-30 12:00:00.000'
      ]);
    });

    it('should work with multiple dates with quantities - 4 x date; 3 x date', (): void => {
      expect(extractBestBefore(3, '4 x 2020-12-31; 3 x 2020-01-01').map(map)).toEqual([
        '2020-12-31 12:00:00.000',
        '2020-12-31 12:00:00.000',
        '2020-12-31 12:00:00.000',
        '2020-12-31 12:00:00.000',
        '2020-01-01 12:00:00.000',
        '2020-01-01 12:00:00.000',
        '2020-01-01 12:00:00.000'
      ]);
    });

    it('should work with multiple dates with quantities - 2 x date; 1 x none', (): void => {
      expect(extractBestBefore(3, '2 x 2022-01-22; 1 x nie podano').map(map)).toEqual([
        '2022-01-22 12:00:00.000',
        '2022-01-22 12:00:00.000',
        null
      ]);
    });
  });
});
