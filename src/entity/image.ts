import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { GENERIC_LENGTH } from './length-config';
import { Product } from './product';
import { stringConfig } from './string-config';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', { length: GENERIC_LENGTH, ...stringConfig })
  public filename: string;

  @Column({ default: 0 })
  public sortOrder: number;

  @ManyToOne(type => Product)
  public product: Product;
}
