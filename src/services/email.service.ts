import { getRepository, Repository } from 'typeorm';

import { getSecretConfig } from '../config';
import { DEFAULT_ATTACHMENTS } from '../email-templates/default';
import { Email } from '../entity/email';
import { SecretConfig } from '../models/model';
import { SimpleGmail } from '../simple-gmail/simple-gmail';

export class EmailService {
  public constructor(protected repository: Repository<Email> = getRepository(Email)) {}

  public async getEmailsForSend(limit: number): Promise<Email[]> {
    return await this.repository
      .createQueryBuilder('email')
      .select(['id', 'to', 'subject', 'html', 'createdAt'].map(c => `email.${c}`))
      .orderBy('email.id', 'ASC')
      .where('email.isSent = :isSent', { isSent: false })
      .limit(limit)
      .getMany();
  }

  public async sendEmails(emails: Email[]): Promise<void> {
    const simpleGmail: SimpleGmail = this.getSimpleGmail();

    for (let i = 0; i < emails.length; i++) {
      const email: Email = emails[i];

      if (!email.isSent) {
        await simpleGmail.send(email.to, email.subject, email.html, DEFAULT_ATTACHMENTS);
        email.isSent = true;
        await this.repository.save(email);
      }
    }
  }

  protected getSimpleGmail(): SimpleGmail {
    const secretConfig: SecretConfig = getSecretConfig();

    return new SimpleGmail({
      clientId: secretConfig.gmail.clientId,
      clientSecret: secretConfig.gmail.clientSecret,
      from: secretConfig.gmail.from,
      refreshToken: secretConfig.gmail.refreshToken,
      user: secretConfig.gmail.user
    });
  }
}
