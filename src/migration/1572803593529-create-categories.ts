import { MigrationInterface, QueryRunner } from 'typeorm';

import { Category } from '../entity/category';
import { CategoryFixture } from '../models/category.model';
import { categoryFixtures, categoryNameToIdMap } from './fixtures/categories';

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
      const node: CategoryFixture = outerNode[i];
      const category = new Category();

      category.name = node.name;
      category.slug = node.slug;
      node.content && (category.content = node.content.replace(/\s\s+/g, ' '));
      node.structuralNode && (category.structuralNode = node.structuralNode);
      node.isUnAccessible && (category.isUnAccessible = node.isUnAccessible);
      category.parent = parent;
      await queryRunner.manager.save(category);

      if (categoryNameToIdMap[category.name] === null) {
        categoryNameToIdMap[category.name] = category.id;
      }

      if (node.children && node.children.length) {
        await this.insertCategories(queryRunner, node.children, category);
      }
    }
  }
}
