import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { DeliveryType, PaymentType, Type } from '../models/product.model';
import { PRODUCT_NAME_LENGTH } from './length-config';
import { Order } from './order';
import { Product } from './product';
import { stringConfig } from './string-config';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', { length: PRODUCT_NAME_LENGTH, ...stringConfig })
  public name: string;

  @Column('decimal', { precision: 5, scale: 2 })
  public vat: number;

  @Column('decimal', { precision: 7, scale: 2 })
  public priceUnitSelling: number; // use 0 when product was destroyed by accident but was already paid by client

  @Column('decimal', { precision: 7, scale: 2 })
  public priceUnitOriginal: number;

  @Column() // duplicate order item with NEGATIVE quantity when product is unavailable but was already paid
  public quantity: number;

  @Column('enum', { enum: Type, nullable: false, ...stringConfig })
  public type: Type;

  @Column('enum', { enum: DeliveryType, nullable: true, default: undefined, ...stringConfig })
  public deliveryType: DeliveryType;

  @Column('enum', { enum: PaymentType, nullable: true, default: undefined, ...stringConfig })
  public paymentType: PaymentType;

  @ManyToOne(type => Order)
  public order: Order;

  @ManyToOne(type => Product)
  public product: Product;

  @Column()
  public productId: number;
}
