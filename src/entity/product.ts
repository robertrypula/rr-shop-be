import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn
} from 'typeorm';

import { Status } from '../models/order.models';
import { DeliveryType, PaymentType, Type } from '../models/product.models';
import { Category } from './category';
import { decimalPriceConfig } from './decimal-config';
import { Distributor } from './distributor';
import { Image } from './image';
import {
  BARCODE_LENGTH,
  GENERIC_TAGS_LENGTH,
  PKWIU_LENGTH,
  PRODUCT_CASH_REGISTER_NAME_LENGTH,
  PRODUCT_NAME_LENGTH
} from './length-config';
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

  @Index({ unique: true })
  @Column('varchar', { length: PRODUCT_NAME_LENGTH, ...stringConfig })
  public name: string;

  @Column('varchar', { length: GENERIC_TAGS_LENGTH, nullable: true, default: null, ...stringConfig })
  public tags: string;

  @Index({ unique: true })
  @Column('varchar', { length: PRODUCT_CASH_REGISTER_NAME_LENGTH, nullable: true, default: null, ...stringConfig })
  public nameCashRegister: string;

  @Index({ unique: true })
  @Column('varchar', { length: PRODUCT_NAME_LENGTH, ...stringConfig })
  public slug: string;

  @Column({ type: 'mediumtext', ...stringConfig })
  public description: string;

  @Column({ default: 0 })
  public sortOrder: number;

  @Column('decimal', { ...decimalPriceConfig })
  public priceUnit: number;

  @Column('decimal', { ...decimalPriceConfig, nullable: true, default: null })
  public priceUnitBeforePromotion: number;

  @Column('varchar', { length: PKWIU_LENGTH, nullable: true, default: null, ...stringConfig })
  public pkwiu: string;

  @Index({ unique: true })
  @Column('varchar', { length: BARCODE_LENGTH, nullable: true, default: null, ...stringConfig })
  public barcode: string;

  @Column('mediumtext', { nullable: true, default: null, ...stringConfig })
  public notes: string;

  @Column('enum', { enum: Type, nullable: false, default: Type.Product, ...stringConfig })
  public type: Type;

  public quantity: number;

  @Column('boolean', { default: false })
  public isHidden: boolean;

  @Column('enum', { enum: DeliveryType, nullable: true, default: undefined, ...stringConfig })
  public deliveryType: DeliveryType;

  @Column('enum', { enum: PaymentType, nullable: true, default: undefined, ...stringConfig })
  public paymentType: PaymentType;

  @OneToMany(type => OrderItem, (orderItem: OrderItem) => orderItem.product)
  public orderItems: OrderItem[];

  @OneToMany(type => Image, (image: Image) => image.product, { cascade: ['insert'] })
  public images: Image[];

  @OneToMany(type => Supply, (supply: Supply) => supply.product, { cascade: ['insert'] })
  public supplies: Supply[];

  // https://github.com/typeorm/typeorm/issues/3507
  // @RelationId functionality is complex.. It's subject of rework in next versions of typeorm
  // @RelationId((product: Product) => product.supplies)
  // public suppliesIds: number[];

  @ManyToOne(type => Distributor, { cascade: ['insert'] })
  public distributor: Distributor;

  @ManyToOne(type => Manufacturer, { cascade: ['insert'] })
  public manufacturer: Manufacturer;

  @ManyToMany(type => Category, category => category.products)
  @JoinTable()
  public categories: Category[];

  // TODO I'm not really sure if this is ok, investigate it and then add...
  // https://stackoverflow.com/questions/43747765/self-referencing-manytomany-relationship-typeorm
  // https://github.com/typeorm/typeorm/issues/1511
  // @ManyToMany(type => Product, product => product.products)
  // @JoinTable()
  // public products: Product[];

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
    const suppliesQuantity: number = this.supplies
      ? this.supplies.reduce((a: number, c: Supply): number => {
          return a + (c.isUnavailable === true ? 0 : 1);
        }, 0)
      : 0;
    const orderItemsQuantity: number = this.orderItems
      ? this.orderItems.reduce((a: number, c: OrderItem): number => {
          return a + (c.order && c.order.status !== Status.Canceled ? c.quantity : 0);
        }, 0)
      : 0;

    if (dropRelations) {
      this.supplies = undefined;
      this.orderItems = undefined;
    }

    this.quantity = this.type === Type.Product ? suppliesQuantity - orderItemsQuantity : -12345; // TODO remove magic n.
  }

  public getSuppliesCountAttachedToGivenOrderItemId(orderItemId: number): number {
    if (!this.supplies) {
      throw 'Supplies array missing in calculations related to it';
    }

    return this.supplies.reduce(
      (accumulator: number, supply: Supply): number => accumulator + (supply.orderItemId === orderItemId ? 1 : 0),
      0
    );
  }
}
