import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { DeliveryType, PaymentType, Type } from '../models/product.models';
import { getNormalizedPrice } from '../utils/transformation.utils';
import { decimalPriceConfig } from './decimal-config';
import { PRODUCT_NAME_LENGTH, UUID_LENGTH } from './length-config';
import { Order } from './order';
import { Product } from './product';
import { stringConfig } from './string-config';
import { Supply } from './supply';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  public id: number;

  @Index({ unique: true })
  @Column('varchar', { length: UUID_LENGTH, ...stringConfig })
  public uuid: string;

  @Column('varchar', { length: PRODUCT_NAME_LENGTH, ...stringConfig })
  public name: string;

  @Column('decimal', { ...decimalPriceConfig })
  public priceUnitOriginal: number;

  @Column('decimal', { ...decimalPriceConfig })
  public priceUnitSelling: number;

  @Column() // duplicate order item with NEGATIVE quantity when product is unavailable but was already paid
  public quantity: number;

  @Column('enum', { enum: Type, nullable: false, default: Type.Product, ...stringConfig })
  public type: Type;

  @Column('enum', { enum: DeliveryType, nullable: true, default: undefined, ...stringConfig })
  public deliveryType: DeliveryType;

  @Column('enum', { enum: PaymentType, nullable: true, default: undefined, ...stringConfig })
  public paymentType: PaymentType;

  @ManyToOne(type => Order)
  public order: Order;

  @ManyToOne(type => Product)
  public product: Product;

  @OneToMany(type => Supply, (supply: Supply) => supply.orderItem)
  public supplies: Supply[];

  @Column()
  public productId: number;

  public getCalculatedPriceUnitSelling(): number {
    if (!this.order) {
      throw `Cannot calculate selling unit price when there is no order attached to orderItem`;
    }
    if (!this.type) {
      throw `Cannot calculate selling unit price when there is no type set in orderItem`;
    }

    return getNormalizedPrice(this.priceUnitOriginal * this.getPromoCodeDiscountMultiplier());
  }

  public getPriceTotalOriginal(): number {
    return this.priceUnitOriginal * this.quantity;
  }

  public getPriceTotalSelling(): number {
    return this.priceUnitSelling * this.quantity;
  }

  public getSortOrder(): number {
    switch (this.type) {
      case Type.Product:
        return 0;
      case Type.Delivery:
        return 1;
      case Type.Payment:
        return 2;
    }

    return 0;
  }

  protected getPromoCodeDiscountMultiplier(): number {
    if (this.type === Type.Product && this.order && this.order.promoCode) {
      return this.order.promoCode.getDiscountMultiplier();
    }

    return 1;
  }
}
