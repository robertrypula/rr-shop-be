import { join } from 'path';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { Category } from '../entity/category';
import { StructuralNode } from '../models/category.models';
import { getSlugFromPolishString } from '../utils/name.utils';
import { removeMultipleWhitespaceCharacters } from '../utils/transformation.utils';
import { fileLoad } from '../utils/utils';
import { CategoryTsvRow } from './fixtures/dtos';

// tslint:disable:object-literal-sort-keys
// tslint:disable:no-console

export class CreateCategories1572803593529 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const categoryTsvRows: CategoryTsvRow[] = this.getCategoryTsvRows();
    const categoryMap: { [level: number]: Category } = {};

    for (let i = 1; i < categoryTsvRows.length; i++) {
      const categoryTsvRow: CategoryTsvRow = categoryTsvRows[i];
      const content: string = this.getContent(categoryTsvRows[i].contentFilename);
      const category = new Category();
      const level = categoryTsvRow.tree.length;
      const name = categoryTsvRow.tree[categoryTsvRow.tree.length - 1];

      category.structuralNode = categoryTsvRow.structuralNode;
      category.isNotClickable = categoryTsvRow.isNotClickable === true ? true : undefined;
      category.isWithoutProducts = categoryTsvRow.isWithoutProducts === true ? true : undefined;
      category.isInternal = categoryTsvRow.isInternal === true ? true : undefined;
      category.name = name;
      category.slug = getSlugFromPolishString(name);
      category.content = content;
      category.parent = level > 0 ? categoryMap[level - 1] : null;

      await queryRunner.manager.save(category);
      categoryMap[level] = category;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // empty
  }

  protected getCategoryTsvRows(): CategoryTsvRow[] {
    const categoryTsvRows: CategoryTsvRow[] = [];
    let categoryTsvLines: string[] = [];

    try {
      categoryTsvLines = fileLoad(join(__dirname, '/fixtures/categories.tsv')).split('\n');
      // tslint:disable-next-line:no-empty
    } catch (e) {}

    for (let i = 0; i < categoryTsvLines.length; i++) {
      const rowData: string[] = categoryTsvLines[i].split('\t');

      categoryTsvRows.push({
        structuralNode: rowData[0] === '' ? null : (rowData[0] as StructuralNode),
        isNotClickable: rowData[1] === '1',
        isWithoutProducts: rowData[2] === '1',
        isInternal: rowData[3] === '1',
        contentFilename: rowData[4],
        tree: this.getTree(5, rowData)
      });
    }

    return categoryTsvRows;
  }

  protected getTree(startIndex: number, rowData: string[]): string[] {
    const result: string[] = [];

    for (let i = startIndex; i < rowData.length; i++) {
      const value = removeMultipleWhitespaceCharacters(rowData[i]).trim();
      result.push(value);
      if (value.length > 2) {
        break;
      }
    }

    return result;
  }

  protected getContent(filename: string): string {
    let content: string = null;

    try {
      content = fileLoad(join(__dirname, `/fixtures/category-contents/${filename}`));
    } catch (e) {
      // console.log(`${e}`);
    }

    return content;
  }
}
