import { TestCase } from '../models/models';
import { getIdRangeName } from './utils';

describe('Utils', (): void => {
  describe('getIdRangeName', (): void => {
    it('should generate proper name for couple of IDs in range 16', (): void => {
      const testCases: Array<TestCase<number, string>> = [
        { input: 1, output: '001-016' },
        { input: 16, output: '001-016' },
        { input: 17, output: '017-032' },
        { input: 128, output: '113-128' },
        { input: 129, output: '129-144' },
        { input: 130, output: '129-144' }
      ];

      testCases.forEach((testCase: TestCase<number, string>): void => {
        expect(getIdRangeName(testCase.input, 16, 3)).toBe(testCase.output);
      });
    });

    it('should generate proper name for couple of IDs in range 64', (): void => {
      const testCases: Array<TestCase<number, string>> = [
        { input: 1, output: '001-064' },
        { input: 16, output: '001-064' },
        { input: 17, output: '001-064' },
        { input: 128, output: '065-128' },
        { input: 129, output: '129-192' },
        { input: 130, output: '129-192' }
      ];

      testCases.forEach((testCase: TestCase<number, string>): void => {
        expect(getIdRangeName(testCase.input, 64, 3)).toBe(testCase.output);
      });
    });
  });
});
