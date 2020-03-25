import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { DeliveryType, PaymentType, Type } from '../models/product.model';
import { Order } from './order';
import { Product } from './product';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column('decimal', { precision: 5, scale: 2 })
  public vat: number;

  @Column('decimal', { precision: 7, scale: 2 })
  public priceUnitSelling: number;

  @Column('decimal', { precision: 7, scale: 2 })
  public priceUnitOriginal: number;

  @Column()
  public quantity: number;

  @Column('boolean', { default: true })
  public sold: boolean; // false when product was destroyed by accident by shop staff but was already paid by client

  @Column('enum', { enum: Type, nullable: false })
  public type: Type;

  @Column('enum', { enum: DeliveryType, nullable: true, default: undefined })
  public deliveryType: DeliveryType;

  @Column('enum', { enum: PaymentType, nullable: true, default: undefined })
  public paymentType: PaymentType;

  @ManyToOne(type => Order)
  public order: Order;

  @ManyToOne(type => Product)
  public product: Product;
}
