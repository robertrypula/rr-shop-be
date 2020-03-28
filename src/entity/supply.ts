import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './order';
import { Product } from './product';

@Entity()
export class Supply {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('decimal', { precision: 5, scale: 2 })
  public vat: number;

  @Column('decimal', { precision: 7, scale: 2 })
  public priceUnitGross: number;

  @Column({ nullable: true, default: null })
  public bestBefore: Date;

  @ManyToOne(type => Product)
  public product: Product;

  @ManyToOne(type => Order)
  public order: Order;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
