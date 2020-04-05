import { getRepository, Repository } from 'typeorm';

import { Email } from '../entity/email';

export class EmailService {
  public constructor(protected repository: Repository<Email> = getRepository(Email)) {}

  public async add(emailTo: string, title: string, body: string): Promise<Email> {
    const email: Email = new Email();

    email.emailTo = emailTo;
    email.title = title;
    email.body = body;

    return await this.repository.save(email);
  }
}
