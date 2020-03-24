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

  @Column({ nullable: true, default: null })
  public nameCashRegister: string;

  @Column()
  public slug: string;

  @Column({ type: 'text' })
  public description: string;

  @Column('decimal', { precision: 5, scale: 2 })
  public vat: number;

  @Column('decimal', { precision: 7, scale: 2 })
  public priceUnit: number;

  @Column({ nullable: true, default: null })
  public pkwiu: string;

  @Column({ nullable: true, default: null })
  public barcode: string;

  @Column('text', { nullable: true, default: null })
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
