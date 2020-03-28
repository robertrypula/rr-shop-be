import { join } from 'path';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { Category } from '../entity/category';
import { fileLoad, parsePrice, removeMultipleSpaces, removeSpaces } from '../utils/utils';
import { DescriptionMdFile, MainTsvRow } from './fixtures/import.dtos';

// tslint:disable:object-literal-sort-keys
// tslint:disable:no-console

export class CreateProducts1572821783055 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const categories: Category[] = await queryRunner.manager.getRepository(Category).find({ select: ['id', 'name'] });
    const mainTsvRows: MainTsvRow[] = this.getMainTsvRows();

    console.log(mainTsvRows[0]);
    console.log(this.getDescriptionMdFile(mainTsvRows[0].descriptionFile));

    console.log(mainTsvRows[1]);
    console.log(this.getDescriptionMdFile(mainTsvRows[1].descriptionFile));

    console.log(mainTsvRows[2]);
    console.log(this.getDescriptionMdFile(mainTsvRows[2].descriptionFile));

    //
    // for (let i = 0; i < productFixtures.length; i++) {
    //   const productFixture: ProductFixture = productFixtures[i];
    //   const product = new Product();
    //
    //   product.name = productFixture[0][0];
    //   product.slug = productFixture[0][1];
    //   product.priceUnit = productFixture[0][2];
    //   product.vat = 8.0; // TODO add it to fixtues
    //   product.barcode = productFixture[0][4];
    //   product.type =
    //     !productFixture[0][5] && !productFixture[0][6]
    //       ? Type.Product
    //       : productFixture[0][5] && !productFixture[0][6]
    //       ? Type.Delivery
    //       : Type.Payment;
    //   product.deliveryType = productFixture[0][5];
    //   product.paymentType = productFixture[0][6];
    //   // TODO add quantity to 'supply'
    //
    //   product.categories = [];
    //   productFixture[1].forEach((categoryName: string): void => {
    //     const category = categories.find(value => value.name === categoryName);
    //
    //     category && product.categories.push(category);
    //   });
    //
    //   product.images = [];
    //   productFixture[2].forEach((filename: string, index: number): void => {
    //     const image: Image = new Image();
    //
    //     image.filename = filename;
    //     image.sortOrder = index + 1;
    //     product.images.push(image);
    //   });
    //
    //   product.description = productFixture[3].replace(/\s\s+/g, ' ');
    //
    //   await queryRunner.manager.save(product);
    // }
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
          type: rowData[3].trim(),
          quantity: +rowData[4],
          priceNet: parsePrice(rowData[5]),
          vat: parsePrice(rowData[6]),
          priceGross: parsePrice(rowData[7]),
          bestBefore: rowData[8].trim(),
          supplier: rowData[9].trim(),
          pkwiu: rowData[10].trim(),
          descriptionFile: removeSpaces(rowData[11]),
          imageFile: removeSpaces(rowData[12])
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
    let name = '';
    let supplier = '';

    if (linesRest.length > 0 && linesRest[0].trim() === '') {
      const [lineEmpty, ...linesRestInner] = linesRest;

      description = linesRestInner.join('\n');
    } else {
      description = linesRest.join('\n');
    }

    if (lineFirstSplit.length > 1) {
      supplier = removeMultipleSpaces(lineFirstSplit[lineFirstSplit.length - 1]).trim();
      lineFirstSplit = lineFirstSplit.splice(0, lineFirstSplit.length - 1);
      name = this.cleanProductName(lineFirstSplit.join(','));
    } else {
      name = this.cleanProductName(lineFirst);
    }

    return {
      description,
      name,
      supplier
    };
  }

  protected cleanProductName(name: string): string {
    let result: string = removeMultipleSpaces(name).trim();

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
