import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { EMAIL_LENGTH, GENERIC_LENGTH } from './length-config';
import { stringConfig } from './string-config';

@Entity()
export class Email {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', { length: EMAIL_LENGTH, ...stringConfig })
  public emailTo: string;

  @Column('varchar', { length: GENERIC_LENGTH, ...stringConfig })
  public title: string;

  @Column({ type: 'mediumtext', ...stringConfig })
  public body: string;

  @Column({ default: false })
  public isSent: boolean;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
