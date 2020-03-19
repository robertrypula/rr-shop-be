import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class EmailQueue {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public emailTo: string;

  @Column()
  public title: string;

  @Column({ type: 'text' })
  public body: string;

  @Column()
  public isSent: boolean;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
