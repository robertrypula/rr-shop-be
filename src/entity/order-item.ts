import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Order } from './order';
import { Product } from './product';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public unitPrice: number;

  @Column()
  public unitPriceOriginal: number;

  @Column()
  public quantity: number;

  @ManyToOne(type => Order)
  public order: Order;

  @ManyToOne(type => Product)
  public product: Product;
}
