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
import { Distributor } from './distributor';
import { Image } from './image';
import { PRODUCT_NAME_LENGTH } from './length-config';
import { Manufacturer } from './manufacturer';
import { OrderItem } from './order-item';
import { stringConfig } from './string-config';
import { Supply } from './supply';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: true, default: null })
  public externalId: number;

  @Column('varchar', { length: PRODUCT_NAME_LENGTH, ...stringConfig })
  public name: string;

  @Column('varchar', { length: 40, nullable: true, default: null, ...stringConfig })
  public nameCashRegister: string;

  @Column('varchar', { length: PRODUCT_NAME_LENGTH, ...stringConfig })
  public slug: string;

  @Column({ type: 'text', ...stringConfig })
  public description: string;

  @Column({ default: 0 })
  public sortOrder: number;

  @Column('decimal', { precision: 7, scale: 2 })
  public priceUnit: number;

  @Column('varchar', { length: 20, nullable: true, default: null, ...stringConfig })
  public pkwiu: string;

  @Column({ nullable: true, default: null, ...stringConfig })
  public barcode: string;

  @Column('text', { nullable: true, default: null, ...stringConfig })
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

  @ManyToOne(type => Distributor, { cascade: ['insert'] })
  public distributor: Distributor;

  @ManyToOne(type => Manufacturer, { cascade: ['insert'] })
  public manufacturer: Manufacturer;

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
    const suppliesQuantity: number = this.supplies.length;
    const orderItemsQuantity: number = this.orderItems.reduce((a: number, c: OrderItem): number => a + c.quantity, 0);

    if (dropRelations) {
      this.supplies = undefined;
      this.orderItems = undefined;
    }

    this.quantity = suppliesQuantity - orderItemsQuantity; // TODO filter out CANCELLED orders - they don't count
  }
}
