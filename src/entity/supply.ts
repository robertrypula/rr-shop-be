import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product';

@Entity()
export class Supply {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public priceUnitPurchase: number;

  @Column()
  public quantity: number;

  @Column({ nullable: true, default: null })
  public bestBefore: Date;

  @ManyToOne(type => Product)
  public product: Product;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
