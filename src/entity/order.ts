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

import { Status } from '../models/order.models';
import { Type } from '../models/product.models';
import { getNormalizedPrice } from '../utils/transformation.utils';
import { Email } from './email';
import {
  EMAIL_LENGTH,
  GENERIC_FORM_LENGTH,
  ORDER_NUMBER_LENGTH,
  PARCEL_LOCKER_LENGTH,
  PARCEL_NUMBER_LENGTH,
  PHONE_LENGTH,
  UUID_LENGTH,
  ZIP_CODE_LENGTH
} from './length-config';
import { OrderItem } from './order-item';
import { Payment } from './payment';
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
  @Column('varchar', { length: ORDER_NUMBER_LENGTH, ...stringConfig }) // example: W-123-456-789
  public number: string;

  @OneToMany(type => Email, (email: Email) => email.order, { cascade: ['insert'] })
  public emails: Email[];

  @OneToMany(type => OrderItem, (orderItem: OrderItem) => orderItem.order, { cascade: ['insert'] })
  public orderItems: OrderItem[];

  @OneToMany(type => Payment, (payment: Payment) => payment.order, { cascade: ['insert'] })
  public payments: Payment[];

  @ManyToOne(type => PromoCode)
  public promoCode: PromoCode;

  // ----------

  @Column('varchar', { length: EMAIL_LENGTH, ...stringConfig })
  public email: string;

  @Column('varchar', { length: PHONE_LENGTH, ...stringConfig })
  public phone: string;

  @Column('varchar', { length: GENERIC_FORM_LENGTH, ...stringConfig })
  public name: string;

  @Column('varchar', { length: GENERIC_FORM_LENGTH, ...stringConfig })
  public surname: string;

  @Column('varchar', { length: GENERIC_FORM_LENGTH, ...stringConfig })
  public address: string;

  @Column('varchar', { length: ZIP_CODE_LENGTH, ...stringConfig })
  public zipCode: string;

  @Column('varchar', { length: GENERIC_FORM_LENGTH, ...stringConfig })
  public city: string;

  @Column({ type: 'mediumtext', nullable: true, default: null, ...stringConfig })
  public comments: string;

  @Column('varchar', { length: PARCEL_LOCKER_LENGTH, nullable: true, default: null, ...stringConfig })
  public parcelLocker: string;

  @Column('varchar', { length: PARCEL_NUMBER_LENGTH, nullable: true, default: null, ...stringConfig })
  public parcelNumber: string;

  // ----------

  @Column('enum', { enum: Status, nullable: false, default: Status.PaymentWait, ...stringConfig })
  public status: Status;

  // ----------

  @Column({ type: 'mediumtext', nullable: true, default: null, ...stringConfig })
  public notes: string;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;

  public isTypeAndLengthOfOrderItemValid(): boolean {
    return (
      this.getOrderItemsByType([Type.Product]).length > 0 &&
      this.getOrderItemsByType([Type.Delivery]).length === 1 &&
      this.getOrderItemsByType([Type.Payment]).length === 1
    );
  }

  public getOrderItemsByType(types: Type[]): OrderItem[] {
    return this.orderItems.filter((orderItem: OrderItem): boolean => types.includes(orderItem.type));
  }

  public getDeliveryOrderItem(): OrderItem {
    const deliveryOrderItems: OrderItem[] = this.getOrderItemsByType([Type.Delivery]);

    return deliveryOrderItems.length === 1 ? deliveryOrderItems[0] : null;
  }

  public getPaymentOrderItem(): OrderItem {
    const paymentOrderItems: OrderItem[] = this.getOrderItemsByType([Type.Payment]);

    return paymentOrderItems.length === 1 ? paymentOrderItems[0] : null;
  }

  public getPriceTotalOriginal(types: Type[]): number {
    return getNormalizedPrice(
      this.getOrderItemsByType(types).reduce(
        (accumulator: number, orderItem: OrderItem): number => accumulator + orderItem.getPriceTotalOriginal(),
        0
      )
    );
  }

  public getPriceTotalSelling(types: Type[]): number {
    return getNormalizedPrice(
      this.getOrderItemsByType(types).reduce(
        (accumulator: number, orderItem: OrderItem): number => accumulator + orderItem.getPriceTotalSelling(),
        0
      )
    );
  }
}
