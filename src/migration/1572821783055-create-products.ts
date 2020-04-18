import { join } from 'path';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { Category } from '../entity/category';
import { Distributor } from '../entity/distributor';
import { Image } from '../entity/image';
import { Manufacturer } from '../entity/manufacturer';
import { Product } from '../entity/product';
import { Supply } from '../entity/supply';
import { DeliveryType, PaymentType, Type } from '../models/product.models';
import { getCashRegisterName, getSlugFromPolishString } from '../utils/name.utils';
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
      product.name =
        mainTsvRow.deliveryType || mainTsvRow.paymentType
          ? mainTsvRow.name
          : descriptionMdFile.name
          ? descriptionMdFile.name
          : '---';
      product.nameCashRegister = getCashRegisterName(mainTsvRow.name, true);
      product.slug = getSlugFromPolishString(product.name);
      product.description = descriptionMdFile.description;
      // product.sortOrder
      product.isHidden = mainTsvRow.isHidden;
      product.priceUnit =
        mainTsvRow.priceUnitSelling > 0 && mainTsvRow.priceUnitSelling < 10000 ? mainTsvRow.priceUnitSelling : 0;
      product.pkwiu = mainTsvRow.pkwiu;
      // product.barcode
      // product.notes
      product.type = mainTsvRow.paymentType ? Type.Payment : mainTsvRow.deliveryType ? Type.Delivery : Type.Product;
      product.paymentType = mainTsvRow.paymentType;
      product.deliveryType = mainTsvRow.deliveryType;
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
        manufacturer.images = [this.createImage(getSlugFromPolishString(manufacturer.name))];
        this.manufacturerMap[descriptionMdFile.manufacturer] = manufacturer;
      }

      product.manufacturer = manufacturer;
    }
  }

  protected getSupplies(mainTsvRow: MainTsvRow): Supply[] {
    const result: Supply[] = [];

    if (mainTsvRow.quantity !== mainTsvRow.bestBeforeDates.length) {
      console.log(mainTsvRow);
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
      mainTsvLines = fileLoad(join(__dirname, '/fixtures/products-0001.tsv')).split('\n');
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
        isHidden: rowData[6] === '1',
        quantity: +rowData[7],
        priceUnitNet: parsePrice(rowData[8]),
        vat: parsePrice(rowData[9]),
        priceUnitGross: parsePrice(rowData[10]),
        bestBeforeDates: extractBestBefore(+rowData[7], rowData[11]),
        distributor: rowData[12].trim(),
        pkwiu: rowData[13].trim(),
        descriptionFilename: removeWhitespaceCharacters(rowData[14]),
        imageFilename: removeWhitespaceCharacters(rowData[15])
          .replace('.jpg', '')
          .replace('.png', ''),
        priceUnitSelling: parsePrice(rowData[16]),
        categories: this.getCategories(rowData, 17)
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

    description = description.replace(/(\*\*.+\*\*) /g, '#### $1\n');
    description = description.replace(/#### \*\*(.+)\*\*/g, '#### $1');
    description = description.replace(/\r/g, '');

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

    return result.trim();
  }

  protected getCategories(rowData: string[], startIndex: number): string[] {
    const categories: string[] = getNormalizedNamesTillTheEnd(rowData, startIndex);
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
    switch (value.trim()) {
      case 'InPostCourier':
        return DeliveryType.InPostCourier;
      case 'InPostParcelLocker':
        return DeliveryType.InPostParcelLocker;
      case 'Own':
        return DeliveryType.Own;
    }

    return null;
  }

  protected getPaymentType(value: string): PaymentType {
    switch (value.trim()) {
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
      descriptionFile = fileLoad(join(__dirname, `/fixtures/products/${filename}`));
    } catch (e) {
      // console.log(`${e}`);
    }

    return descriptionFile;
  }
}
