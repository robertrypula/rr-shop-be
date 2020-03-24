import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { StructuralNode } from '../models/category.model';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ nullable: true, default: null })
  public slug: string;

  @Column({ nullable: true, default: null, type: 'text' })
  public content: string;

  @Column({ nullable: true, default: null })
  public isUnAccessible: boolean;

  @Column({ default: 0 })
  public sortOrder: number;

  @Column('enum', { enum: StructuralNode, nullable: true, default: undefined })
  public structuralNode: StructuralNode;

  @OneToMany(type => Category, (category: Category) => category.parent)
  public children: Category[];

  @Column({ nullable: true })
  public parentId: number;

  @ManyToOne(type => Category)
  public parent: Category;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
