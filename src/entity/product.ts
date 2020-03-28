import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn
} from 'typeorm';

import { DeliveryType, PaymentType, Type } from '../models/product.model';
import { Category } from './category';
import { Image } from './image';
import { OrderItem } from './order-item';
import { Supplier } from './supplier';
import { Supply } from './supply';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: true, default: null })
  public externalId: number;

  @Column()
  public name: string;

  @Column({ nullable: true, default: null })
  public nameCashRegister: string;

  @Column()
  public slug: string;

  @Column({ type: 'text' })
  public description: string;

  @Column({ default: 0 })
  public sortOrder: number;

  @Column('decimal', { precision: 7, scale: 2 })
  public priceUnit: number;

  @Column({ nullable: true, default: null })
  public pkwiu: string;

  @Column({ nullable: true, default: null })
  public barcode: string;

  @Column('text', { nullable: true, default: null })
  public notes: string;

  @Column('enum', { enum: Type, nullable: false, default: Type.Product })
  public type: Type;

  public quantity: number;

  @Column('enum', { enum: DeliveryType, nullable: true, default: undefined })
  public deliveryType: DeliveryType;

  @Column('enum', { enum: PaymentType, nullable: true, default: undefined })
  public paymentType: PaymentType;

  @OneToMany(type => OrderItem, (orderItem: OrderItem) => orderItem.product)
  public orderItems: OrderItem[];

  @OneToMany(type => Image, (image: Image) => image.product, { cascade: ['insert'] })
  public images: Image[];

  @OneToMany(type => Supply, (supply: Supply) => supply.product, { cascade: ['insert'] })
  public supplies: Supply[];

  @ManyToOne(type => Supplier, { cascade: ['insert'] })
  public supplier: Supplier;

  @ManyToMany(type => Category)
  @JoinTable()
  public categories: Category[];

  @RelationId((product: Product) => product.categories)
  public categoryIds: number[]; // https://github.com/typeorm/typeorm/blob/master/docs/decorator-reference.md#relationid

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;

  public calculateQuantity(dropRelations: boolean): void {
    // Alternatives:
    // https://stackoverflow.com/questions/19436895/sql-how-to-to-sum-two-values-from-different-tables
    // https://stackoverflow.com/questions/28329525/multiple-left-join-with-sum
    const suppliesQuantity: number = this.supplies.reduce((a: number, c: Supply): number => a + c.quantity, 0);
    const orderItemsQuantity: number = this.orderItems.reduce((a: number, c: OrderItem): number => a + c.quantity, 0);

    if (dropRelations) {
      this.supplies = undefined;
      this.orderItems = undefined;
    }

    this.quantity = suppliesQuantity - orderItemsQuantity;
  }
}
