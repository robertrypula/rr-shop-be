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
import { GENERIC_NAME_LENGTH } from './length-config';
import { stringConfig } from './string-config';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', { length: GENERIC_NAME_LENGTH, ...stringConfig })
  public name: string;

  @Column('varchar', { length: GENERIC_NAME_LENGTH, nullable: true, default: null, ...stringConfig })
  public slug: string;

  @Column('text', { nullable: true, default: null, ...stringConfig })
  public content: string;

  @Column({ nullable: true, default: null })
  public isUnAccessible: boolean;

  @Column({ default: 0 })
  public sortOrder: number;

  @Column('enum', { enum: StructuralNode, nullable: true, default: undefined, ...stringConfig })
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
