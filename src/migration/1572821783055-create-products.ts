import { MigrationInterface, QueryRunner } from 'typeorm';

import { Category } from '../entity/category';
import { Product } from '../entity/product';
import { ProductFixture } from '../model';

const productFixtures: ProductFixture[] = [
  ['Propolis', 'Medycyna ludowa mówi, że propolis jest dobry', 14.99, 10],
  ['Balsam Jerozolimski', 'Medycyna ludowa mówi, że balsam też jest dobry. Pij go codziennie', 9.99, 7]
];

export class CreateProducts1572821783055 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const categories: Category[] = await queryRunner.manager.getRepository(Category).find({ select: ['id'] });
    let offset = 0;

    for (let i = 0; i < productFixtures.length; i++) {
      const productFixture: ProductFixture = productFixtures[i];
      const product = new Product();

      product.name = productFixture[0];
      product.description = productFixture[1];
      product.price = productFixture[2];
      product.quantity = productFixture[3];
      product.categories = [];

      for (let j = 0; j < Math.min(categories.length, 3); j++) {
        product.categories.push(categories[offset]);
        offset = (offset + 1) % categories.length;
      }

      await queryRunner.manager.save(product);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // empty
  }
}
