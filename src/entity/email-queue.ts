import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { EMAIL_LENGTH, GENERIC_NAME_LENGTH } from './length-config';
import { stringConfig } from './string-config';

@Entity()
export class EmailQueue {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', { length: EMAIL_LENGTH, ...stringConfig })
  public emailTo: string;

  @Column('varchar', { length: GENERIC_NAME_LENGTH, ...stringConfig })
  public title: string;

  @Column({ type: 'text', ...stringConfig })
  public body: string;

  @Column()
  public isSent: boolean;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
