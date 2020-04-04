import { join } from 'path';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { Category } from '../entity/category';
import { StructuralNode } from '../models/category.model';
import { getSlugFromPolishString } from '../utils/product.utils';
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

      category.structuralNode = categoryTsvRow.structuralNode;
      category.isUnAccessible = categoryTsvRow.isUnAccessible;
      category.name = categoryTsvRow.tree[categoryTsvRow.tree.length - 1];
      category.slug = getSlugFromPolishString(categoryTsvRow.tree[categoryTsvRow.tree.length - 1]);
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
        isUnAccessible: rowData[1] === '1',
        contentFilename: rowData[2],
        tree: this.getTree(rowData)
      });
    }

    return categoryTsvRows;
  }

  protected getTree(rowData: string[]): string[] {
    const result: string[] = [];

    for (let i = 3; i < rowData.length; i++) {
      result.push(removeMultipleWhitespaceCharacters(rowData[i]).trim());
      if (rowData[i].length > 2) {
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
      console.log(`${e}`);
    }

    return content;
  }
}
