import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Category } from './category';
import { GENERIC_LENGTH } from './length-config';
import { Manufacturer } from './manufacturer';
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

  @ManyToOne(type => Category)
  public category: Category;

  @Column({ nullable: true })
  public categoryId: number;

  @ManyToOne(type => Product)
  public product: Product;

  @Column({ nullable: true })
  public productId: number;

  @ManyToOne(type => Manufacturer)
  public manufacturer: Manufacturer;

  @Column({ nullable: true })
  public manufacturerId: number;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
