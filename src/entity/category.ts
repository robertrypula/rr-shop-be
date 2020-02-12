import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ nullable: true, default: null })
  public slug: string;

  @Column({ nullable: true, default: null })
  public content: string;

  @Column({ nullable: true, default: null })
  public isUnAccessible: boolean;

  @Column({ nullable: true, default: null })
  public structuralNode: string;

  @OneToMany(type => Category, (category: Category) => category.parent)
  public children: Category[];

  @Column({ nullable: true })
  public parentId: number;

  @ManyToOne(type => Category)
  public parent: Category;
}
