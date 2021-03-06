import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { GENERIC_LENGTH } from './length-config';
import { Product } from './product';
import { stringConfig } from './string-config';

@Entity()
export class Distributor {
  @PrimaryGeneratedColumn()
  public id: number;

  @Index({ unique: true })
  @Column('varchar', { length: GENERIC_LENGTH, ...stringConfig })
  public name: string;

  @OneToMany(type => Product, (product: Product) => product.distributor)
  public products: Product[];

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
