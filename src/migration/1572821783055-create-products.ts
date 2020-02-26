import { MigrationInterface, QueryRunner } from 'typeorm';

import { Category } from '../entity/category';
import { Image } from '../entity/image';
import { Product } from '../entity/product';
import { productFixtures } from '../fixtures/products';
import { ProductFixture } from '../model';

export class CreateProducts1572821783055 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const categories: Category[] = await queryRunner.manager.getRepository(Category).find({ select: ['id'] });

    for (let i = 0; i < productFixtures.length; i++) {
      const productFixture: ProductFixture = productFixtures[i];
      const product = new Product();

      product.name = productFixture[0][0];
      product.slug = productFixture[0][1];
      product.price = productFixture[0][2];
      product.quantity = productFixture[0][3];
      product.barCode = productFixture[0][4];

      product.categories = [];
      productFixture[1].forEach(categoryId => {
        const category = categories.find(value => value.id === categoryId);

        category && product.categories.push(category);
      });

      product.images = [];
      productFixture[2].forEach((filename: string, index: number): void => {
        const image: Image = new Image();

        image.filename = filename;
        image.order = index + 1;
        product.images.push(image);
      });

      product.description = productFixture[3].replace(/\s\s+/g, ' ');

      await queryRunner.manager.save(product);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // empty
  }
}
