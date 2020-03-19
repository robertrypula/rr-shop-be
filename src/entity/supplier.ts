import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Product } from './product';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: number;

  @OneToMany(type => Product, (product: Product) => product.supplier)
  public products: Product[];

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
