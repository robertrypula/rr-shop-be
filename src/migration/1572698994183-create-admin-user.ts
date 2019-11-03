import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';

import { User } from '../entity/user';

export class CreateAdminUser1572698994183 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const user = new User();

    user.username = 'admin';
    user.password = 'admin';
    user.role = 'ADMIN';
    user.hashPassword();

    await getRepository(User).save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // empty
  }
}
