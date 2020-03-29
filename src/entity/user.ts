import { compareSync, hashSync } from 'bcryptjs';
import { IsNotEmpty, Length } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

import { stringConfig } from './string-config';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', { length: 20, ...stringConfig })
  @Length(4, 20)
  public username: string;

  @Column('varchar', { length: 100, ...stringConfig })
  @Length(4, 100)
  public password: string;

  @Column('varchar', { length: 20, ...stringConfig })
  @IsNotEmpty()
  public role: string;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;

  public hashPassword(): void {
    this.password = hashSync(this.password, 8);
  }

  public checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): boolean {
    return compareSync(unencryptedPassword, this.password);
  }
}
