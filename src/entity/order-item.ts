import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Order } from './order';
import { Product } from './product';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public nameOriginal: string;

  @Column()
  public priceUnitSelling: number;

  @Column()
  public priceUnitOriginal: number;

  @Column()
  public quantity: number;

  @ManyToOne(type => Order)
  public order: Order;

  @ManyToOne(type => Product)
  public product: Product;
}
