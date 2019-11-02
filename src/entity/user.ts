import { compareSync, hashSync } from 'bcryptjs';
import { IsNotEmpty, Length } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @Length(4, 20)
  public username: string;

  @Column()
  @Length(4, 100)
  public password: string;

  @Column()
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
