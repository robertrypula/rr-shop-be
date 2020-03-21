import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { Status } from '../models/order.model';
import { OrderItem } from './order-item';
import { PromoCode } from './promo-code';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public uuid: string;

  @Column()
  public number: string;

  @OneToMany(type => OrderItem, (orderItem: OrderItem) => orderItem.order, { cascade: ['insert'] })
  public orderItems: OrderItem[];

  @ManyToOne(type => PromoCode)
  public promoCode: PromoCode;

  // ----------

  @Column()
  public email: string;

  @Column()
  public phone: string;

  // ----------

  @Column()
  public name: string;

  @Column()
  public surname: string;

  @Column()
  public address: string;

  @Column()
  public zipCode: string;

  @Column()
  public city: string;

  @Column({ type: 'text', nullable: true, default: null })
  public comments: string;

  @Column({ nullable: true, default: null })
  public parcelLocker: string;

  // ----------

  @Column('enum', { enum: Status })
  public status: Status;

  @Column({ nullable: true, default: null })
  public paymentUrl: string;

  // ----------

  @Column({ type: 'text', nullable: true, default: null })
  public notes: string;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
