import { IsEmail, IsNotEmpty, IsOptional, Length, MaxLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { Status } from '../models/order.model';
import {
  EMAIL_LENGTH,
  GENERIC_FORM_LENGTH,
  ORDER_NUMBER_LENGTH,
  PARCEL_LOCKER_LENGTH,
  PHONE_LENGTH,
  TEXT_AREA_LENGTH,
  URL_LENGTH,
  UUID_LENGTH,
  ZIP_CODE_LENGTH
} from './length-config';
import { OrderItem } from './order-item';
import { PromoCode } from './promo-code';
import { stringConfig } from './string-config';
import { Supply } from './supply';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  public id: number;

  @Index({ unique: true })
  @Column('varchar', { length: UUID_LENGTH, ...stringConfig })
  public uuid: string;

  @Index({ unique: true })
  @Column('varchar', { length: ORDER_NUMBER_LENGTH, ...stringConfig }) // example: WA-123-456
  public number: string;

  @OneToMany(type => OrderItem, (orderItem: OrderItem) => orderItem.order, { cascade: ['insert'] })
  public orderItems: OrderItem[];

  @OneToMany(type => Supply, (supply: Supply) => supply.order)
  public supplies: Supply[];

  @ManyToOne(type => PromoCode)
  public promoCode: PromoCode;

  // ----------

  @Column('varchar', { length: EMAIL_LENGTH, ...stringConfig })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(EMAIL_LENGTH)
  public email: string;

  @Column('varchar', { length: PHONE_LENGTH, ...stringConfig })
  @MaxLength(PHONE_LENGTH)
  @IsNotEmpty()
  public phone: string;

  @Column('varchar', { length: GENERIC_FORM_LENGTH, ...stringConfig })
  @MaxLength(GENERIC_FORM_LENGTH)
  @IsNotEmpty()
  public name: string;

  @Column('varchar', { length: GENERIC_FORM_LENGTH, ...stringConfig })
  @MaxLength(GENERIC_FORM_LENGTH)
  @IsNotEmpty()
  public surname: string;

  @Column('varchar', { length: GENERIC_FORM_LENGTH, ...stringConfig })
  @MaxLength(GENERIC_FORM_LENGTH)
  @IsNotEmpty()
  public address: string;

  @Column('varchar', { length: ZIP_CODE_LENGTH, ...stringConfig })
  @MaxLength(ZIP_CODE_LENGTH)
  @IsNotEmpty()
  public zipCode: string;

  @Column('varchar', { length: GENERIC_FORM_LENGTH, ...stringConfig })
  @MaxLength(GENERIC_FORM_LENGTH)
  @IsNotEmpty()
  public city: string;

  @Column({ type: 'mediumtext', nullable: true, default: null, ...stringConfig })
  @IsOptional()
  @MaxLength(TEXT_AREA_LENGTH)
  public comments: string;

  @Column('varchar', { length: PARCEL_LOCKER_LENGTH, nullable: true, default: null, ...stringConfig })
  @IsOptional()
  @MaxLength(PARCEL_LOCKER_LENGTH)
  public parcelLocker: string;

  // ----------

  @Column('enum', { enum: Status, ...stringConfig })
  public status: Status;

  @Column('varchar', { length: URL_LENGTH, nullable: true, default: null, ...stringConfig })
  public paymentUrl: string;

  // ----------

  @Column({ type: 'mediumtext', nullable: true, default: null, ...stringConfig })
  public notes: string;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
