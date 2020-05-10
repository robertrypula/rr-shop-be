import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { decimalPercentageConfig, decimalPriceConfig } from './decimal-config';
import { OrderItem } from './order-item';
import { Product } from './product';
import { stringConfig } from './string-config';

@Entity()
export class Supply {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('decimal', { ...decimalPercentageConfig })
  public vat: number;

  @Column('decimal', { ...decimalPriceConfig })
  public priceUnitGross: number;

  @Column({ nullable: true, default: null })
  public bestBefore: Date;

  @ManyToOne(type => Product)
  public product: Product;

  @Column()
  public productId: number;

  @Column('boolean', { default: false }) // use to mark which product was destroyed, lost or best before date expired
  public isUnavailable: boolean; // do NOT use together with 'orderItem' field

  @ManyToOne(type => OrderItem) // use ONLY to mark which best before dates product are gone
  public orderItem: OrderItem; // do NOT use together with 'isUnavailable' field or Quantity calculation

  @Column({ nullable: true })
  public orderItemId: number;

  @Column({ type: 'mediumtext', nullable: true, default: null, ...stringConfig })
  public notes: string;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
