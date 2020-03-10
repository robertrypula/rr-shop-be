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
  public startAt: Date;

  @Column()
  public endAt: Date;

  @OneToMany(type => Order, (order: Order) => order.promoCode)
  public order: Order[];
}
