import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { GENERIC_NAME_LENGTH } from './length-config';
import { Product } from './product';
import { stringConfig } from './string-config';

@Entity()
export class Distributor {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', { length: GENERIC_NAME_LENGTH, ...stringConfig })
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
