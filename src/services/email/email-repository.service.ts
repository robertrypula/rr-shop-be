import { getRepository, Repository } from 'typeorm';

import { Email } from '../../entity/email';

export class EmailRepositoryService {
  public constructor(protected repository: Repository<Email> = getRepository(Email)) {}

  public async getEmailsNotYetSent(limit: number): Promise<Email[]> {
    return await this.repository
      .createQueryBuilder('email')
      .select(['id', 'to', 'subject', 'html', 'createdAt'].map(c => `email.${c}`))
      .orderBy('email.id', 'ASC')
      .where('email.isSent = :isSent', { isSent: false })
      .limit(limit)
      .getMany();
  }
}
