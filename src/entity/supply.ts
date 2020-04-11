import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { decimalPercentageConfig, decimalPriceConfig } from './decimal-config';
import { Order } from './order';
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

  @Column('boolean', { default: false }) // use to mark that product was destroyed, lost or best before date expired
  public isUnavailable: boolean; // do NOT use together with 'order' field

  @ManyToOne(type => Order) // do NOT use together with 'isUnavailable' field
  public order: Order; // do NOT use to calculate quantity, it's to track which best before dates product are gone

  @Column({ type: 'mediumtext', nullable: true, default: null, ...stringConfig })
  public notes: string;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
