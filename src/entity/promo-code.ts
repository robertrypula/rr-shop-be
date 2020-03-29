import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { GENERIC_NAME_LENGTH } from './length-config';
import { Order } from './order';
import { stringConfig } from './string-config';

@Entity()
export class PromoCode {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', { length: GENERIC_NAME_LENGTH, ...stringConfig })
  public name: string;

  @Column('decimal', { precision: 5, scale: 2 })
  public percentageDiscount: number;

  @Column('boolean')
  public isActive: boolean;

  @OneToMany(type => Order, (order: Order) => order.promoCode)
  public order: Order[];
}