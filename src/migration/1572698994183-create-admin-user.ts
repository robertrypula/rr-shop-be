import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';

import { getSecretConfig } from '../config';
import { User } from '../entity/user';
import { SecretConfig } from '../models/model';

export class CreateAdminUser1572698994183 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const secretConfig: SecretConfig = getSecretConfig();
    const user = new User();

    user.username = secretConfig.admin.username;
    user.password = secretConfig.admin.password;
    user.role = 'ADMIN';
    user.hashPassword();

    await getRepository(User).save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // empty
  }
}
