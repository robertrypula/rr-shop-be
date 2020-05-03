import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { IP_LENGTH, QUERY_LENGTH } from './length-config';
import { stringConfig } from './string-config';

@Entity()
export class LogSearch {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', { length: IP_LENGTH, ...stringConfig })
  public ip: string;

  @Column('varchar', { length: QUERY_LENGTH, ...stringConfig })
  public query: string;

  @Column()
  public resultCount: number;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  public setIp(ip: string): LogSearch {
    this.ip = ip;

    return this;
  }

  public setQuery(query: string): LogSearch {
    this.query = query;

    return this;
  }

  public setResultCount(resultCount: number): LogSearch {
    this.resultCount = resultCount;

    return this;
  }
}
