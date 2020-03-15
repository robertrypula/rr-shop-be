import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Order } from './order';

@Entity()
export class PromoCode {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public percentageDiscount: number;

  @Column()
  public isActive: boolean;

  @OneToMany(type => Order, (order: Order) => order.promoCode)
  public order: Order[];
}
