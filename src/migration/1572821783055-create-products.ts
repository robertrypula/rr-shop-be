import { join } from 'path';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { Category } from '../entity/category';
import { Distributor } from '../entity/distributor';
import { Image } from '../entity/image';
import { Manufacturer } from '../entity/manufacturer';
import { Product } from '../entity/product';
import { Type } from '../models/product.model';
import { getCashRegisterName, getSlugFromPolishString } from '../utils/product.utils';
import { fileLoad, parsePrice, removeMultipleWhitespaceCharacters, removeWhitespaceCharacters } from '../utils/utils';
import { DescriptionMdFile, MainTsvRow } from './fixtures/import.dtos';

// tslint:disable:object-literal-sort-keys
// tslint:disable:no-console

export class CreateProducts1572821783055 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const categories: Category[] = await queryRunner.manager.getRepository(Category).find({ select: ['id', 'name'] });
    const mainTsvRows: MainTsvRow[] = this.getMainTsvRows();

    for (let i = 0; i < mainTsvRows.length; i++) {
      const mainTsvRow: MainTsvRow = mainTsvRows[i];
      const descriptionMdFile: DescriptionMdFile = this.getDescriptionMdFile(mainTsvRows[i].descriptionFilename);
      const product = new Product();
      const image = new Image();

      product.externalId = mainTsvRow.id;
      product.name = descriptionMdFile.name ? descriptionMdFile.name : mainTsvRow.name;
      product.nameCashRegister = getCashRegisterName(product.name, false);
      product.slug = getSlugFromPolishString(product.name);
      product.description = descriptionMdFile.description;
      // product.sortOrder
      product.priceUnit = mainTsvRow.priceUnitGross; // TODO it still not selling price
      product.pkwiu = mainTsvRow.pkwiu;
      // product.barcode
      // product.notes
      product.type = Type.Product;

      // ----

      image.filename = mainTsvRow.imageFilename;
      product.images = [image];

      // ----

      // mainTsvRow.quantity;
      // mainTsvRow.bestBefore
      // mainTsvRow.vat
      // mainTsvRow.priceUnitGross

      // ----

      const distributor = new Distributor();
      distributor.name = mainTsvRow.distributor;
      product.distributor = distributor;

      // ----

      const manufacturer = new Manufacturer();
      manufacturer.name = descriptionMdFile.manufacturer;
      product.manufacturer = manufacturer;

      // ----

      product.categories = [];

      // ----

      await queryRunner.manager.save(product);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // empty
  }

  protected getMainTsvRows(): MainTsvRow[] {
    const mainTsvRows: MainTsvRow[] = [];
    let mainTsvLines: string[] = [];

    try {
      mainTsvLines = fileLoad(join(__dirname, '/fixtures/main.tsv')).split('\n');
      // tslint:disable-next-line:no-empty
    } catch (e) {}

    mainTsvLines.forEach((mainTsvLine: string): void => {
      const rowData: string[] = mainTsvLine.split('\t');

      if (rowData.length > 12) {
        mainTsvRows.push({
          id: +rowData[0],
          name: rowData[1].trim(),
          categoryLikeType: rowData[3].trim(),
          quantity: +rowData[4],
          priceUnitNet: parsePrice(rowData[5]),
          vat: parsePrice(rowData[6]),
          priceUnitGross: parsePrice(rowData[7]),
          bestBefore: rowData[8].trim(),
          distributor: rowData[9].trim(),
          pkwiu: rowData[10].trim(),
          descriptionFilename: removeWhitespaceCharacters(rowData[11]),
          imageFilename: removeWhitespaceCharacters(rowData[12])
        });
      }
    });

    return mainTsvRows;
  }

  protected getDescriptionMdFile(filename: string): DescriptionMdFile {
    const descriptionFile: string = this.loadDescriptionFile(filename);
    const lines: string[] = descriptionFile.split('\n');
    const [lineFirst, ...linesRest] = lines;
    let lineFirstSplit: string[] = lineFirst.split(',');
    let description = '';
    let manufacturer = '';
    let name = '';

    if (linesRest.length > 0 && linesRest[0].trim() === '') {
      const [lineEmpty, ...linesRestInner] = linesRest;

      description = linesRestInner.join('\n');
    } else {
      description = linesRest.join('\n');
    }

    if (lineFirstSplit.length > 1) {
      manufacturer = removeMultipleWhitespaceCharacters(lineFirstSplit[lineFirstSplit.length - 1]).trim();
      lineFirstSplit = lineFirstSplit.splice(0, lineFirstSplit.length - 1);
      name = this.cleanProductName(lineFirstSplit.join(','));
    } else {
      name = this.cleanProductName(lineFirst);
    }

    return {
      description,
      manufacturer,
      name
    };
  }

  protected cleanProductName(name: string): string {
    let result: string = removeMultipleWhitespaceCharacters(name).trim();

    if (result.indexOf('##') === 0) {
      result = result.substr(2);
    }

    return result;
  }

  protected loadDescriptionFile(filename: string): string {
    let descriptionFile: string = '';

    try {
      descriptionFile = fileLoad(join(__dirname, `/fixtures/product-descriptions/${filename}`));
    } catch (e) {
      console.log(`${e}`);
    }

    return descriptionFile;
  }
}
