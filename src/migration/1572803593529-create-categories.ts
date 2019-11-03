import { MigrationInterface, QueryRunner } from 'typeorm';

import { Category } from '../entity/category';
import { CategoryFixture } from '../model';

const categoryFixtures: CategoryFixture[] = [
  ['Zioła', [['produkty ziołowe', null], ['zioła dla kobiet', null], ['zioła dla meżczyzn', null]]],
  ['Suplementy', null],
  ['Kosmetyki', [['dla mężczyzn', null], ['dla kobiet', null], ['dla dzieci', null]]],
  ['Ekologiczne środki czystości', null],
  ['Zdrowa żywność', null],
  ['Herbaty', [['zielone', null], ['czarne', null], ['owocowe', null], ['ziołowe', null]]],
  ['Kawy', null],
  ['Olejki', null]
];

export class CreateCategories1572803593529 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await this.insertCategories(queryRunner, categoryFixtures, null);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // empty
  }

  protected async insertCategories(
    queryRunner: QueryRunner,
    outerNode: CategoryFixture[],
    parent: Category
  ): Promise<void> {
    for (let i = 0; i < outerNode.length; i++) {
      const node = outerNode[i];
      const category = new Category();

      category.name = node[0];
      category.parent = parent;
      await queryRunner.manager.save(category);

      if (node[1] && node[1].length) {
        await this.insertCategories(queryRunner, node[1], category);
      }
    }
  }
}
