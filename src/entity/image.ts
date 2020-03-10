import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public filename: string;

  @Column()
  public order: number;

  @ManyToOne(type => Product)
  public product: Product;
}
