import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Category } from './category';
import { Image } from './image';
import { OrderItem } from './order-item';

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

  @Column({ nullable: true, default: null })
  public vat: number;

  @Column()
  public price: number;

  @Column()
  public quantity: number; // https://github.com/typeorm/typeorm/issues/680

  @Column()
  public barCode: string;

  @ManyToMany(type => Category)
  @JoinTable()
  public categories: Category[];

  @OneToMany(type => Image, (image: Image) => image.product, { cascade: ['insert'] })
  public images: Image[];

  @OneToMany(type => OrderItem, (orderItem: OrderItem) => orderItem.product)
  public orderItems: OrderItem[];

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;

  public categoryIds: number[];
}
