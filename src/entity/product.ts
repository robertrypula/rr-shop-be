import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { Category } from './category';
import { Image } from './image';
import { OrderItem } from './order-item';
import { Supplier } from './supplier';
import { Supply } from './supply';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public slug: string;

  @Column({ type: 'text' })
  public description: string;

  @Column()
  public vat: number;

  @Column()
  public priceUnit: number;

  @Column({ nullable: true, default: null })
  public pkwiu: string;

  @Column()
  public quantity: number; // https://github.com/typeorm/typeorm/issues/680

  @Column({ nullable: true, default: null })
  public barCode: string;

  @Column({ type: 'text', nullable: true, default: null })
  public notes: string;

  @OneToMany(type => OrderItem, (orderItem: OrderItem) => orderItem.product)
  public orderItems: OrderItem[];

  @OneToMany(type => Image, (image: Image) => image.product, { cascade: ['insert'] })
  public images: Image[];

  @OneToMany(type => Supply, (supply: Supply) => supply.product, { cascade: ['insert'] })
  public supplies: Supply[];

  @ManyToOne(type => Supplier)
  public supplier: Supplier;

  @ManyToMany(type => Category)
  @JoinTable()
  public categories: Category[];

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;

  public categoryIds: number[];
}
