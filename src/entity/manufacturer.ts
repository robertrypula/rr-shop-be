import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Product } from './product';

@Entity()
export class Manufacturer {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', { length: 60 })
  public name: string;

  @OneToMany(type => Product, (product: Product) => product.manufacturer)
  public products: Product[];

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
