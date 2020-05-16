import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { StructuralNode } from '../models/category.models';
import { Image } from './image';
import { CATEGORY_LINK_TEXT_LENGTH, GENERIC_LENGTH } from './length-config';
import { Product } from './product';
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

  @Column('mediumtext', { nullable: true, default: null, ...stringConfig })
  public contentShort: string;

  @Column({ nullable: true, default: null })
  public isNotClickable: boolean;

  @Column({ nullable: true, default: null })
  public isHiddenListOfProducts: boolean;

  @Column({ nullable: true, default: null })
  public isVisibleListOfCategories: boolean;

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

  @OneToMany(type => Category, (category: Category) => category.link)
  public linkedBy: Category[];

  @Column({ nullable: true })
  public linkId: number;

  @ManyToOne(type => Category)
  public link: Category;

  @Column('varchar', { length: CATEGORY_LINK_TEXT_LENGTH, nullable: true, default: null, ...stringConfig })
  public linkText: string;

  @Column({ nullable: true, default: null })
  public linkOpenInNewTab: boolean;

  @OneToMany(type => Image, (image: Image) => image.category, { cascade: ['insert'] })
  public images: Image[];

  @ManyToMany(type => Product, product => product.categories)
  public products: Product[];

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
