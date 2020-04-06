import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Image } from './image';
import { GENERIC_LENGTH } from './length-config';
import { Product } from './product';
import { stringConfig } from './string-config';

@Entity()
export class Manufacturer {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', { length: GENERIC_LENGTH, ...stringConfig })
  public name: string;

  @OneToMany(type => Product, (product: Product) => product.manufacturer)
  public products: Product[];

  @OneToMany(type => Image, (image: Image) => image.manufacturer, { cascade: ['insert'] })
  public images: Image[];

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
