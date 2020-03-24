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

  @Column('varchar', { length: 36 })
  public uuid: string;

  @Column('varchar', { length: 10 }) // example: WA-123-456
  public number: string;

  @OneToMany(type => OrderItem, (orderItem: OrderItem) => orderItem.order, { cascade: ['insert'] })
  public orderItems: OrderItem[];

  @ManyToOne(type => PromoCode)
  public promoCode: PromoCode;

  // ----------

  @Column('varchar', { length: 200 })
  public email: string;

  @Column('varchar', { length: 60 })
  public phone: string;

  @Column('varchar', { length: 100 })
  public name: string;

  @Column('varchar', { length: 100 })
  public surname: string;

  @Column('varchar', { length: 100 })
  public address: string;

  @Column('varchar', { length: 12 })
  public zipCode: string;

  @Column('varchar', { length: 100 })
  public city: string;

  @Column({ type: 'text', nullable: true, default: null })
  public comments: string;

  @Column('varchar', { length: 100, nullable: true, default: null })
  public parcelLocker: string;

  // ----------

  @Column('enum', { enum: Status })
  public status: Status;

  @Column('varchar', { length: 1024, nullable: true, default: null })
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
