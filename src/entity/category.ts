import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { StructuralNode } from '../models/category.models';
import { GENERIC_LENGTH } from './length-config';
import { stringConfig } from './string-config';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', { length: GENERIC_LENGTH, ...stringConfig })
  public name: string;

  @Column('varchar', { length: GENERIC_LENGTH, nullable: true, default: null, ...stringConfig })
  public slug: string;

  @Column('mediumtext', { nullable: true, default: null, ...stringConfig })
  public content: string;

  @Column({ nullable: true, default: null })
  public isNotClickable: boolean;

  @Column({ nullable: true, default: null })
  public isWithoutProducts: boolean;

  @Column({ nullable: true, default: null })
  public isHidden: boolean;

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
