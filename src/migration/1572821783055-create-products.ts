import { join } from 'path';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { Category } from '../entity/category';
import { Distributor } from '../entity/distributor';
import { Image } from '../entity/image';
import { Manufacturer } from '../entity/manufacturer';
import { Product } from '../entity/product';
import { Supply } from '../entity/supply';
import { DeliveryType, PaymentType, Type } from '../models/product.model';
import { getCashRegisterName, getSlugFromPolishString } from '../utils/product.utils';
import {
  extractBestBefore,
  getNormalizedNamesTillTheEnd,
  parsePrice,
  removeMultipleWhitespaceCharacters,
  removeWhitespaceCharacters
} from '../utils/transformation.utils';
import { fileLoad, getDuplicates, getIdRangeName } from '../utils/utils';
import { DescriptionMdFile, MainTsvRow } from './fixtures/dtos';

// tslint:disable:object-literal-sort-keys
// tslint:disable:no-console

//
// export const productFixtures: ProductFixture[] = [
//   [['Odbiór osobisty', '', 0.0, 1000000, '', DeliveryType.Own, null], [DELIVERIES], [], ``],
//   [['Paczkomaty', '', 8.99, 1000000, '', DeliveryType.Paczkomaty, null], [DELIVERIES], [], ``],
//   [['Kurier', '', 12.0, 1000000, '', DeliveryType.Courier, null], [DELIVERIES], [], ``],
//   [['Przelew bankowy', '', 0.0, 1000000, '', null, PaymentType.BankTransfer], [PAYMENTS], [], ``],
//   [['Płatność elektroniczna PayU', '', 0.5, 1000000, '', null, PaymentType.PayU], [PAYMENTS], [], ``]
// ];

export class CreateProducts1572821783055 implements MigrationInterface {
  protected distributorMap: { [key: string]: Distributor } = {};
  protected manufacturerMap: { [key: string]: Manufacturer } = {};

  public async up(queryRunner: QueryRunner): Promise<any> {
    const categories: Category[] = await queryRunner.manager.getRepository(Category).find({ select: ['id', 'name'] });
    const mainTsvRows: MainTsvRow[] = this.getMainTsvRows();

    for (let i = 1; i < mainTsvRows.length; i++) {
      const mainTsvRow: MainTsvRow = mainTsvRows[i];
      const descriptionMdFile: DescriptionMdFile = this.getDescriptionMdFile(mainTsvRows[i].descriptionFilename);
      const product = new Product();

      product.externalId = mainTsvRow.id;
      product.name = descriptionMdFile.name ? descriptionMdFile.name : mainTsvRow.name;
      product.nameCashRegister = getCashRegisterName(product.name, true);
      product.slug = getSlugFromPolishString(product.name);
      product.description = descriptionMdFile.description;
      // product.sortOrder
      product.priceUnit =
        mainTsvRow.priceUnitSelling > 0 && mainTsvRow.priceUnitSelling < 10000 ? mainTsvRow.priceUnitSelling : 0;
      product.pkwiu = mainTsvRow.pkwiu;
      // product.barcode
      // product.notes
      product.type = Type.Product;
      product.images = [this.createImage(mainTsvRow.imageFilename)];
      product.supplies = this.getSupplies(mainTsvRow);
      this.attachDistributor(mainTsvRow, product);
      this.attachManufacturer(descriptionMdFile, product);

      // ----

      product.categories = [];
      mainTsvRow.categories.push(getIdRangeName(mainTsvRow.id, 16, 3));
      mainTsvRow.categories.push(getIdRangeName(mainTsvRow.id, 64, 3));
      mainTsvRow.categories.forEach((category: string): void => {
        const categoryFromDb: Category = categories.find(value => value.name === category);
        categoryFromDb && product.categories.push(categoryFromDb);
      });

      // ----

      await queryRunner.manager.save(product);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // empty
  }

  protected attachDistributor(mainTsvRow: MainTsvRow, product: Product): void {
    if (mainTsvRow.distributor) {
      let distributor: Distributor;

      if (this.distributorMap[mainTsvRow.distributor]) {
        distributor = this.distributorMap[mainTsvRow.distributor];
      } else {
        distributor = new Distributor();
        distributor.name = mainTsvRow.distributor;
        this.distributorMap[mainTsvRow.distributor] = distributor;
      }

      product.distributor = distributor;
    }
  }

  protected attachManufacturer(descriptionMdFile: DescriptionMdFile, product: Product): void {
    if (descriptionMdFile.manufacturer) {
      let manufacturer: Manufacturer;

      if (this.manufacturerMap[descriptionMdFile.manufacturer]) {
        manufacturer = this.manufacturerMap[descriptionMdFile.manufacturer];
      } else {
        manufacturer = new Manufacturer();
        manufacturer.name = descriptionMdFile.manufacturer;
        this.manufacturerMap[descriptionMdFile.manufacturer] = manufacturer;
      }

      product.manufacturer = manufacturer;
    }
  }

  protected getSupplies(mainTsvRow: MainTsvRow): Supply[] {
    const result: Supply[] = [];

    if (mainTsvRow.quantity !== mainTsvRow.bestBeforeDates.length) {
      throw new Error('Mismatch in best before data and quantity data');
    }

    mainTsvRow.bestBeforeDates.forEach((bestBeforeDate: Date): void => {
      result.push(this.createSupply(mainTsvRow, bestBeforeDate));
    });

    return result;
  }

  protected createImage(filename: string): Image {
    const image: Image = new Image();

    image.filename = filename;

    return image;
  }

  protected createSupply(mainTsvRow: MainTsvRow, bestBefore: Date): Supply {
    const supply: Supply = new Supply();

    supply.priceUnitGross = mainTsvRow.priceUnitGross;
    supply.vat = mainTsvRow.vat;
    supply.bestBefore = bestBefore;

    return supply;
  }

  protected getMainTsvRows(): MainTsvRow[] {
    const mainTsvRows: MainTsvRow[] = [];
    let mainTsvLines: string[] = [];

    try {
      mainTsvLines = fileLoad(join(__dirname, '/fixtures/main.tsv')).split('\n');
      // tslint:disable-next-line:no-empty
    } catch (e) {}

    for (let i = 0; i < mainTsvLines.length; i++) {
      const rowData: string[] = mainTsvLines[i].split('\t');

      if (rowData[2] === 'END') {
        break;
      }

      mainTsvRows.push({
        deliveryType: this.getDeliveryType(rowData[0]),
        paymentType: this.getPaymentType(rowData[1]),
        id: +rowData[2],
        name: rowData[3].trim(),
        categoryLikeType: rowData[5].trim(),
        quantity: +rowData[6],
        priceUnitNet: parsePrice(rowData[7]),
        vat: parsePrice(rowData[8]),
        priceUnitGross: parsePrice(rowData[9]),
        bestBeforeDates: extractBestBefore(+rowData[6], rowData[10]),
        distributor: rowData[11].trim(),
        pkwiu: rowData[12].trim(),
        descriptionFilename: removeWhitespaceCharacters(rowData[13]),
        imageFilename: removeWhitespaceCharacters(rowData[14])
          .replace('.jpg', '')
          .replace('.png', ''),
        priceUnitSelling: parsePrice(rowData[15]),
        categories: this.getCategories(rowData)
      });
    }

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

  protected getCategories(rowData: string[]): string[] {
    const categories: string[] = getNormalizedNamesTillTheEnd(rowData, 16);
    const duplicates: string[] = getDuplicates(categories);

    if (duplicates.length) {
      console.log(rowData);
      console.log(categories);
      console.log(duplicates);
      throw new Error('Category list contains duplicates');
    }

    return categories;
  }

  protected getDeliveryType(value: string): DeliveryType {
    switch (value) {
      case 'InPostCourier':
        return DeliveryType.InPostCourier;
      case 'InPostParcelLock':
        return DeliveryType.InPostParcelLocker;
      case 'Own':
        return DeliveryType.Own;
    }

    return null;
  }

  protected getPaymentType(value: string): PaymentType {
    switch (value) {
      case 'BankTransfer':
        return PaymentType.BankTransfer;
      case 'PayU':
        return PaymentType.PayU;
    }

    return null;
  }

  protected loadDescriptionFile(filename: string): string {
    let descriptionFile: string = '';

    try {
      descriptionFile = fileLoad(join(__dirname, `/fixtures/product-descriptions/${filename}`));
    } catch (e) {
      // console.log(`${e}`);
    }

    return descriptionFile;
  }
}
