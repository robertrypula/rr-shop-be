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
import { EMAIL_LENGTH } from './length-config';
import { OrderItem } from './order-item';
import { PromoCode } from './promo-code';
import { stringConfig } from './string-config';
import { Supply } from './supply';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', { length: 36, ...stringConfig })
  public uuid: string;

  @Column('varchar', { length: 10, ...stringConfig }) // example: WA-123-456
  public number: string;

  @OneToMany(type => OrderItem, (orderItem: OrderItem) => orderItem.order, { cascade: ['insert'] })
  public orderItems: OrderItem[];

  @OneToMany(type => Supply, (supply: Supply) => supply.order)
  public supplies: Supply[];

  @ManyToOne(type => PromoCode)
  public promoCode: PromoCode;

  // ----------

  @Column('varchar', { length: EMAIL_LENGTH, ...stringConfig })
  public email: string;

  @Column('varchar', { length: 60, ...stringConfig })
  public phone: string;

  @Column('varchar', { length: 100, ...stringConfig })
  public name: string;

  @Column('varchar', { length: 100, ...stringConfig })
  public surname: string;

  @Column('varchar', { length: 100, ...stringConfig })
  public address: string;

  @Column('varchar', { length: 12, ...stringConfig })
  public zipCode: string;

  @Column('varchar', { length: 100, ...stringConfig })
  public city: string;

  @Column({ type: 'text', nullable: true, default: null, ...stringConfig })
  public comments: string;

  @Column('varchar', { length: 100, nullable: true, default: null, ...stringConfig })
  public parcelLocker: string;

  // ----------

  @Column('enum', { enum: Status })
  public status: Status;

  @Column('varchar', { length: 1024, nullable: true, default: null, ...stringConfig })
  public paymentUrl: string;

  // ----------

  @Column({ type: 'text', nullable: true, default: null, ...stringConfig })
  public notes: string;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
