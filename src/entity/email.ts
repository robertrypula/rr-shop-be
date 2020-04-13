import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { EMAIL_LENGTH, GENERIC_LENGTH } from './length-config';
import { Order } from './order';
import { stringConfig } from './string-config';

@Entity()
export class Email {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', { length: EMAIL_LENGTH, ...stringConfig })
  public to: string;

  @Column('varchar', { length: GENERIC_LENGTH, ...stringConfig })
  public subject: string;

  @Column({ type: 'mediumtext', ...stringConfig })
  public html: string;

  @Column({ default: false })
  public isSent: boolean;

  @ManyToOne(type => Order, { nullable: true })
  public order: Order;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({ nullable: true, default: null })
  public lockedAt: Date; // TODO lock when waiting for gmail in order to avoid overlapping scheduled tasks

  public setTo(to: string): Email {
    this.to = to;

    return this;
  }

  public setSubject(subject: string): Email {
    this.subject = subject;

    return this;
  }

  public setHtml(html: string): Email {
    this.html = html;

    return this;
  }

  public setOrder(order: Order): Email {
    this.order = order;

    return this;
  }
}
