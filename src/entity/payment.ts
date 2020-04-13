import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Status } from '../models/payment.models';
import { PaymentType } from '../models/product.models';
import { decimalPriceConfig } from './decimal-config';
import { GENERIC_URL_LENGTH, PAYMENT_EXTERNAL_ID_LENGTH } from './length-config';
import { Order } from './order';
import { stringConfig } from './string-config';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('decimal', { ...decimalPriceConfig })
  public amount: number;

  @Index({ unique: true })
  @Column('varchar', { length: PAYMENT_EXTERNAL_ID_LENGTH, nullable: true, default: null, ...stringConfig })
  public externalId: string;

  @Column('varchar', { length: GENERIC_URL_LENGTH, nullable: true, default: null, ...stringConfig })
  public url: string;

  @ManyToOne(type => Order)
  public order: Order;

  @Column('enum', { enum: Status, nullable: false, default: Status.Pending, ...stringConfig })
  public status: Status;

  @Column('enum', { enum: PaymentType, nullable: false, default: PaymentType.BankTransfer, ...stringConfig })
  public paymentType: PaymentType;

  @Column({ type: 'mediumtext', nullable: true, default: null, ...stringConfig })
  public logs: string;

  @Column({ type: 'mediumtext', nullable: true, default: null, ...stringConfig })
  public notes: string;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
