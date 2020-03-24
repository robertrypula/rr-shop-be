import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Type } from '../models/order-item.model';
import { Order } from './order';
import { Product } from './product';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public nameOriginal: string;

  @Column('decimal', { precision: 5, scale: 2 })
  public vatOriginal: number;

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

  @ManyToOne(type => Order)
  public order: Order;

  @ManyToOne(type => Product)
  public product: Product;
}
