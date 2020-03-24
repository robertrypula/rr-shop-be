import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Order } from './order';

@Entity()
export class PromoCode {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', { length: 100 })
  public name: string;

  @Column('decimal', { precision: 5, scale: 2 })
  public percentageDiscount: number;

  @Column('boolean')
  public isActive: boolean;

  @OneToMany(type => Order, (order: Order) => order.promoCode)
  public order: Order[];
}
