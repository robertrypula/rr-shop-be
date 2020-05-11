import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { decimalPercentageConfig } from './decimal-config';
import { PROMO_CODE_LENGTH } from './length-config';
import { Order } from './order';
import { stringConfig } from './string-config';

@Entity()
export class PromoCode {
  @PrimaryGeneratedColumn()
  public id: number;

  @Index({ unique: true })
  @Column('varchar', { length: PROMO_CODE_LENGTH, ...stringConfig })
  public name: string;

  @Column('decimal', { ...decimalPercentageConfig })
  public percentageDiscount: number;

  @Column('boolean')
  public isActive: boolean;

  @OneToMany(type => Order, (order: Order) => order.promoCode)
  public order: Order[];

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;

  public getDiscountMultiplier(): number {
    return (100 - this.percentageDiscount) / 100;
  }
}
